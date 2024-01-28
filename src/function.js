// keykeys table.js

window.keykeys.fun.refreshHighlight = function() {
    window.keykeys.fun.refreshScaleNoteNames();

    window.keykeys.fun.clearHighlights();
    let highlight_enabled = document.getElementById("key-highlight").checked;
    if (highlight_enabled) {
        let selected_scale = document.getElementById("key-scale").value;
        window.keykeys.fun.highlightNotesInScale(selected_scale);
        window.keykeys.fun.updateNoteDetails(window.keykeys.data.last_note_name);
    }
    window.keykeys.fun.updateChordDetails();
}

window.keykeys.fun.getNoteAtInterval = function(note_name, interval) {
    // let selected_scale = document.getElementById("key-scale").value;
    // let selected_scale_length = window.keykeys.data.scale_intervals[selected_scale].length;

    let note_names = window.keykeys.data.note_names;
    let note_name_index = note_names.indexOf(note_name);
    let note_name_index_plus_interval = (note_name_index + interval) % 12;

    return note_names[note_name_index_plus_interval];
}

// get the names of the notes in the scale described by the root note and intervals (from root)
// each note_letter should be accounted for in the result, without repeating letters.
// the next note should be the next letter, but flat or sharp if necessary.
// for example, root note may be "A," "A#", "B", "C", etc - and
// the intervals may be, for example, [0,2,4,5,7,9,11], or [0,2,3,5,7,8,10].
window.keykeys.fun.getScaleNotes = function(root_note, intervals) {
    const all_notes = window.keykeys.data.note_names;
    
    if (all_notes.indexOf(root_note) === -1) {
        console.log("getScaleNotes: invalid root note", root_note);
    }

    let scale_notes = [];
    for (let interval of intervals) {
        scale_notes.push(window.keykeys.fun.getNoteAtInterval(root_note, interval));
    }

    let note_letters = ["A", "B", "C", "D", "E", "F", "G"];

    let previous_note = ".";
    for (let i = 0; i < scale_notes.length; i++) {
        let note = scale_notes[i];
        let letter_index = note_letters.indexOf(note[0]);
        if (note[0] === previous_note[0]) {
            scale_notes[i] = note_letters[(letter_index + 1) % note_letters.length] + "b";
        }
        previous_note = scale_notes[i];
    }

    // perform post-processing to fix the root note of the scale; e.g. "A#" -> "Bb"
    let root_note_index = note_letters.indexOf(root_note[0]);
    if (root_note[0] === scale_notes[scale_notes.length - 1][0]) {
        scale_notes[0] = note_letters[(root_note_index + 1) % note_letters.length] + "b";
    }
    
    previous_note = ".";
    for (let i = 0; i < scale_notes.length; i++) {
        let note = scale_notes[i];
        let letter_index = note_letters.indexOf(note[0]);
        if (note[0] === previous_note[0]) {
            scale_notes[i] = note_letters[(letter_index + 1) % note_letters.length] + "b";
        }
        previous_note = scale_notes[i];
    }

    return scale_notes;
}

// given a scale name and a degree,
// return the roman numeral, e.g. "I", "II", "iii", "vii°", etc,
// and the chord type, e.g. "major", "minor", "diminished", etc,
// and the chord notes, e.g. "C", "E", "G", etc, and return as an object
window.keykeys.fun.determineChordAtDegree = function(scale_name, degree) {
    let scale_intervals = window.keykeys.data.scale_intervals[scale_name];
    let chord_root_interval = scale_intervals[degree - 1];
    let chord_intervals = [chord_root_interval];
    let chord_details = {
        "roman_numeral": "",
        "chord_type": "",
        "chord_notes": [],
        "degree": degree,
    };

    // fill out chord_intervals with the other intervals for the chord
    chord_intervals.push(scale_intervals[(degree + 1) % scale_intervals.length]);
    chord_intervals.push(scale_intervals[(degree + 3) % scale_intervals.length]);

    // determine the roman numeral based on whether the chord is major, minor, or diminished
    // the roman numeral is capitalized if the secord chord interval is major (4 semitones away)
    // and lowercase if the second chord interval is minor (3 semitones away)
    // and lowercase with a degree symbol if the third chord interval is diminished (6 semitones away)
    let second = 0;
    let third = 0;
    if (chord_intervals[0] > chord_intervals[1]) {
        second = chord_intervals[1] + 12 - chord_intervals[0];
    } else {
        second = chord_intervals[1] - chord_intervals[0];
    }
    if (chord_intervals[0] > chord_intervals[2]) {
        third = chord_intervals[2] + 12 - chord_intervals[0];
    } else {
        third = chord_intervals[2] - chord_intervals[0];
    }
    
    if (second == 4) {
        chord_details["roman_numeral"] = window.keykeys.data.chord_roman_numerals[degree - 1].toUpperCase();
        chord_details["chord_type"] = "major";
    } else {
        chord_details["roman_numeral"] = window.keykeys.data.chord_roman_numerals[degree - 1].toLowerCase();
        chord_details["chord_type"] = "minor"
    }
    if (third == 6) {
        chord_details["roman_numeral"] += "°";
        chord_details["chord_type"] = "dim.";
    }

    // determine the chord note names based on scale_note_names and whether
    // the note is the root note, second note, or third note of the chord
    // bear in mind that unlike note_names, which includes all 12 semitones,
    // scale_note_names only contains as many notes as there are intervals in the scale
    let scale_note_names = window.keykeys.data.scale_note_names;
    for (let chord_degree of [0, 2, 4]) {
        let scale_note_index = (degree - 1 + chord_degree) % scale_note_names.length;
        chord_details["chord_notes"].push(scale_note_names[scale_note_index]);
    }
    
    // for (let chord_interval of chord_intervals) {
    //     chord_details["chord_notes"].push(window.keykeys.fun.getNoteAtInterval(
    //         root_note, chord_interval)
    //     );
    // }

    return chord_details;
}

// update the chord details based on the selected scale
window.keykeys.fun.updateChordDetails = function() {
    // let root_note = document.getElementById("key-root-note").value;
    let selected_scale = document.getElementById("key-scale").value;
    
    let chords_details_in_scale = [];
    for (let degree = 1; degree <= 7; degree++) {
        chords_details_in_scale.push(window.keykeys.fun.determineChordAtDegree(selected_scale, degree));
    }

    for (let chord_details of chords_details_in_scale) {
        let numeral_element = document.getElementById("chord-" + chord_details["degree"]);
        numeral_element.innerHTML = chord_details["roman_numeral"];

        let name_element = document.getElementById("chord-" + chord_details["degree"] + "-name");
        name_element.innerHTML = chord_details["chord_notes"][0] + " " + chord_details["chord_type"];

        let play_element = document.getElementById("chord-" + chord_details["degree"] + "-play");
        play_element.dataset.notes = chord_details["chord_notes"];
        play_element.innerHTML = chord_details["chord_notes"].join(", ");
    }
}

window.keykeys.fun.updateNoteDetails = function(note_name) {
    let note_name_letter_only = note_name.replace(/[0-9]/g, '');

    let note_num = window.keykeys.data.table_name[note_name]["piano"];
    let note_freq = window.keykeys.data.table_name[note_name]["freq"];
    let note_midi = window.keykeys.data.table_name[note_name]["midi"];

    let root_note = document.getElementById("key-root-note").value;

    let note_names = window.keykeys.data.note_names;
    let note_semitone_distance =
        note_names.indexOf(note_name_letter_only) - note_names.indexOf(root_note);
    note_semitone_distance = (note_semitone_distance + 12) % 12;
    let selected_scale = document.getElementById("key-scale").value;
    let note_in_scale_degree = window.keykeys.data.scale_intervals[selected_scale].indexOf(note_semitone_distance) + 1;
    let note_in_scale_degree_name = window.keykeys.data.scale_degrees[note_in_scale_degree - 1];
    let note_interval_names = window.keykeys.data.scale_interval_names[note_semitone_distance];

    document.getElementById("note-name").innerHTML = note_name;
    document.getElementById("note-number").innerHTML = note_num;
    document.getElementById("note-frequency").innerHTML = note_freq.toFixed(2);
    document.getElementById("note-midi").innerHTML = note_midi;
    document.getElementById("note-semitone-distance").innerHTML = note_semitone_distance;
    document.getElementById("note-root").innerHTML = root_note;

    if (note_in_scale_degree > 0) {
        document.getElementById("note-in-scale").innerHTML = note_in_scale_degree_name + " degree of " + root_note + " " + selected_scale;
    } else {
        document.getElementById("note-in-scale").innerHTML = "not in " + root_note + " " + selected_scale;
    }

    document.getElementById("note-interval-names").innerHTML = note_interval_names.join("<br>- ");
}

window.keykeys.fun.clearHighlights = function() {
    // clear in-scale class from all keys with that class
    let in_scale_keys = document.getElementsByClassName("key");
    for (let in_scale_key of in_scale_keys) {
        in_scale_key.classList.remove(
            "in-scale",
            "interval",
            "interval-1",
            "interval-2",
            "interval-3",
            "interval-4",
            "interval-5",
            "interval-6",
            "interval-7",
            "interval-8",
            "interval-9",
            "interval-10",
            "interval-11"
        );
    }
}

window.keykeys.fun.highlightNotesInScale = function(scale_name) {
    // get the scale root note and intervals
    let scale_root_note = document.getElementById("key-root-note").value;
    let scale_intervals = window.keykeys.data.scale_intervals[scale_name];
    let scale_notes = [];

    // get the note names for notes in this scale with scale root note
    for (let scale_interval of scale_intervals) {
        scale_notes.push(window.keykeys.fun.getNoteAtInterval(scale_root_note, scale_interval));
    }

    // highlight keys with the class of the note names
    let count = 1;
    for (let scale_note of scale_notes) {
        let highlight_class = "interval-" + count.toString();
        
        let scale_note_key_elements = document.getElementsByClassName(scale_note);
        for (let element of scale_note_key_elements) {
            element.classList.add("in-scale", highlight_class);
        }
        count++;
    }
}
