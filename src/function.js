// keykeys table.js

window.keykeys.fun.refreshHighlight = function() {
    window.keykeys.fun.clearHighlights();
    let highlight_enabled = document.getElementById("key-highlight").checked;
    if (highlight_enabled) {
        let selected_scale = document.getElementById("key-scale").value;
        window.keykeys.fun.highlightNotesInScale(selected_scale);
        window.keykeys.fun.updateNoteDetails(window.keykeys.data.last_note_name);
    }
    window.keykeys.fun.updateChordDetails();
}

// given a scale name and a degree,
// return the roman numeral, e.g. "I", "II", "iii", "vii°", etc,
// and the chord type, e.g. "major", "minor", "diminished", etc,
// and the chord notes, e.g. "C", "E", "G", etc, and return as an array
window.keykeys.fun.determineChordAtDegree = function(root_note, scale_name, degree) {
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

    // determine the chord notes based on the root note and the chord intervals
    for (let chord_interval of chord_intervals) {
        chord_details["chord_notes"].push(window.keykeys.fun.getNoteAtInterval(
            root_note, chord_interval)
        );
    }

    return chord_details;
}

// update the chord details based on the selected scale
window.keykeys.fun.updateChordDetails = function() {
    let root_note = document.getElementById("key-root-note").value;
    let selected_scale = document.getElementById("key-scale").value;

    let chords_details_in_scale = [];
    for (let degree = 1; degree <= 7; degree++) {
        chords_details_in_scale.push(window.keykeys.fun.determineChordAtDegree(root_note, selected_scale, degree));
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
        document.getElementById("note-in-scale").innerHTML = "the " + note_in_scale_degree_name + " degree of " + root_note + " " + selected_scale;
    } else {
        document.getElementById("note-in-scale").innerHTML = "not in " + root_note + " " + selected_scale;
    }

    document.getElementById("note-interval-names").innerHTML = note_interval_names.join(", ");
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
        let highlight_class = "interval";
        if (count == 1) {
            highlight_class = "interval-1";
        } else if (count == 2) {
            highlight_class = "interval-2";
        } else if (count == 3) {
            highlight_class = "interval-3";
        } else if (count == 4) {
            highlight_class = "interval-4";
        } else if (count == 5) {
            highlight_class = "interval-5";
        } else if (count == 6) {
            highlight_class = "interval-6";
        } else if (count == 7) {
            highlight_class = "interval-7";
        } else if (count == 8) {
            highlight_class = "interval-8";
        } else if (count == 9) {
            highlight_class = "interval-9";
        } else if (count == 10) {
            highlight_class = "interval-10";
        } else if (count == 11) {
            highlight_class = "interval-11";
        }
        
        let scale_note_key_elements = document.getElementsByClassName(scale_note);
        for (let element of scale_note_key_elements) {
            element.classList.add("in-scale", highlight_class);
        }
        count++;
    }
}
