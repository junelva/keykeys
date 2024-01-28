// keykeys data.js

window.keykeys = {}
window.keykeys.data = {
    "last_note_name": "A2",
    "note_names": ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"],
    "scale_degrees": ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th"],
    "chord_roman_numerals": ["I", "II", "III", "IV", "V", "VI", "VII"],
    "scale_interval_names": [
        ["perfect unison", "perfect octave", "diminished second"],
        ["minor second", "augmented unison"],         // 1 semitone
        ["major second", "diminished third"],         // 2
        ["minor third", "augmented second"],          // 3
        ["major third", "diminished fourth"],         // 4
        ["perfect fourth", "augmented third"],        // 5
        ["diminished fifth", "augmented fourth"],     // 6
        ["perfect fifth", "diminished sixth"],        // 7
        ["minor sixth", "augmented fifth"],           // 8
        ["major sixth", "diminished seventh"],        // 9
        ["minor seventh", "augmented sixth"],         // 10
        ["major seventh", "diminished octave"],       // 11
    ],
    "scale_intervals": {
        "Major": [0,2,4,5,7,9,11],
        "Minor": [0,2,3,5,7,8,10],
        "Double Harmonic": [0,1,4,5,7,8,11],
    },
    "scale_intervals_extra": {
        "Melodic Minor (Asc.)": [0,2,3,5,7,9,11],
        "Melodic Minor (Desc.)": [0,2,3,5,7,8,10],
        "Harmonic Minor": [0,2,3,5,7,8,11],
	
	"Hirajoshi": [0,4,6,7,11],
        "In": [0,1,5,7,8],
        "Insen": [0,1,5,7,10],
        "Iwato": [0,1,5,6,10],        
        "Yo": [0,3,5,7,10],
        "Ritsu": [0,2,5,7,9],

        "Major Pentatonic": [0,2,4,7,9],
        "Harmonic Major": [0,2,4,5,7,8,11],
        
        "Dorian": [0,2,3,5,7,9,10],
        "Ukrainian Dorian": [0,2,3,6,7,9,10],

        "Phrygian": [0,1,3,5,7,8,10],
        "Phrygian Dominant": [0,1,4,5,7,8,10],

        "Lydian": [0,2,4,6,7,9,11],
        "Lydian Augmented": [0,2,4,6,8,9,11],
        
        "Mixolydian": [0,2,4,5,7,9,10],
        
        "Minor Pentatonic": [0,3,5,7,10],
        
        "Locrian": [0,1,3,5,6,8,10],
        "Locrian Major": [0,2,4,5,6,8,10],

        "Bebop Dominant": [0,2,4,5,7,9,10,11],
        "Blues": [0,3,5,6,7,10],

        "Whole Tone": [0,2,4,6,8,10],
        "Tritone": [0,1,4,6,7,10],

        "Acoustic": [0,2,4,6,7,9,10],
        "Altered": [0,1,3,4,6,8,10],
        "Augmented": [0,3,4,7,8,11],
        "Double Harmonic": [0,1,4,5,7,8,11],
        "Enigmatic": [0,1,4,6,8,10,11],
        "Flamenco": [0,1,4,5,7,8,11],
        "Half Diminished": [0,2,3,5,6,8,10],
        "Hungarian Minor": [0,2,3,6,7,8,11],
        "Hungarian Major": [0,3,4,6,7,9,10],
        "Istrian": [0,1,3,4,6,7],
        "Neapolitan": [0,1,3,5,7,9,11],
        "Neapolitan Minor": [0,1,3,5,7,8,11],
        "Persian": [0,1,4,5,6,8,11],
        "Prometheus": [0,2,4,6,9,10],
        "Scale of Harmonics": [0,3,4,5,7,9],

        "Chromatic": [0,1,2,3,4,5,6,7,8,9,10,11],
    }
}
window.keykeys.fun = {}

// Restricts input for the given textbox to the given inputFilter function.
// See here: https://stackoverflow.com/a/469362
function setInputFilter(textbox, inputFilter, errMsg) {
    [ "input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout" ].forEach(function(event) {
        textbox.addEventListener(event, function(e) {
          if (inputFilter(this.value)) {
              // Accepted value.
              if ([ "keydown", "mousedown", "focusout" ].indexOf(e.type) >= 0){
                  this.classList.remove("input-error");
                  this.setCustomValidity("");
              }
  
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
          }
          else if (this.hasOwnProperty("oldValue")) {
              // Rejected value: restore the previous one.
              this.classList.add("input-error");
              this.setCustomValidity(errMsg);
              this.reportValidity();
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
          }
          else {
              // Rejected value: nothing to restore.
              this.value = "";
          }
        });
    });
}

window.keykeys.fun.refreshScaleNoteNames = function() {
    let root_note = document.getElementById("key-root-note").value;
    let selected_scale = document.getElementById("key-scale").value;
    let scale_notes = window.keykeys.fun.getScaleNotes(root_note, window.keykeys.data.scale_intervals[selected_scale]);
    window.keykeys.data.scale_note_names = scale_notes;
}

window.keykeys.fun.createSettingsCallbacks = function() {    
    // restrict piano key count to integers only
    setInputFilter(document.getElementById("piano-key-count"), function(value) {
        return /^\d*$/.test(value);
      }, "Only integer values are allowed."
    );
    
    // refresh piano when piano settings are changed
    [...document.getElementsByClassName("refresh-piano")].forEach(
        function(element) {
            element.addEventListener("change", function() {
                window.keykeys.fun.createPianoBasedOnSettings();
                window.keykeys.fun.refreshHighlight();
            });
        }
    );
    
    // refresh highlight when scale settings are changed
    [...document.getElementsByClassName("refresh-highlight")].forEach(
        function(element) {
            element.addEventListener("change", function() {
                window.keykeys.fun.refreshHighlight();
            });
        }
    );
    
    // use mouse wheel to cycle through select options
    // loop to start when reaching end, and vice versa
    [...document.getElementsByTagName("select")].forEach(
        function(element) {
            element.addEventListener("wheel", function(event) {
                let options = element.options;
                let selected_index = element.selectedIndex;
                let new_index = selected_index + Math.sign(event.deltaY);
                if (new_index < 0) {
                    new_index = options.length - 1;
                } else if (new_index >= options.length) {
                    new_index = 0;
                }
                element.selectedIndex = new_index;

                // dispatch "change" event on the element after scrolling
                element.dispatchEvent(new Event("change"));
            });
        }
    );
}

window.keykeys.fun.createDynamicSelectors = function() {
    // create scale selector
    let scales = window.keykeys.data.scale_intervals;
    let scales_by_length = {};
    for (let scale_name in scales) {
        let scale_length = scales[scale_name].length;
        if (scales_by_length[scale_length] == undefined) {
            scales_by_length[scale_length] = [];
        }
        scales_by_length[scale_length].push(scale_name);
    }
    
    let scale_selector = document.getElementById("key-scale");
    for (let scale_length in scales_by_length) {
        let optgroup = document.createElement("optgroup");
        optgroup.label = scale_length;
        for (let scale_name of scales_by_length[scale_length]) {
            let option = document.createElement("option");
            option.value = scale_name;
            option.innerHTML = scale_name;
            if (scale_name == "Major (Ionian)") {
                option.selected = true;
            }
            optgroup.appendChild(option);
        }
        scale_selector.appendChild(optgroup);
    }

    // create note selectors
    let note_selectors = document.getElementsByClassName("note-select");
    for (let note_selector of note_selectors) {
        for (let note_name of window.keykeys.data.note_names) {
            let option = document.createElement("option");
            option.value = note_name;
            option.innerHTML = note_name;
            note_selector.appendChild(option);
        }
    }

    // create octave selector
    let octave_selector = document.getElementById("piano-start-octave");
    for (let i = 0; i < 9; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        if (i == 2) {
            option.selected = true;
        }
        octave_selector.appendChild(option);
    }
}

window.keykeys.fun.createPiano = function(root_note, root_octave, num_notes) {
    let root_name = root_note + root_octave;
    let root_num = window.keykeys.data.table_name[root_name]["piano"];

    // get piano div and clear it
    let piano_div = document.getElementById("piano");
    while (piano_div.firstChild) {
        piano_div.removeChild(piano_div.firstChild);
    }

    // calculating widths for styling
    let num_note_types = window.keykeys.fun.countNumberOfNaturalAndSharpNotesFromNote(root_note, root_num, num_notes);
    let num_natural_notes = num_note_types[0];
    let natural_width = 100 / num_natural_notes;
    let sharp_width = natural_width * 0.6;

    let natural_display_index = 0;

    // create and append divs for each piano key
    for (let i = root_num; i < root_num + num_notes; i++) {
        if (i > 107) {
            break;
        }
        let note_name = window.keykeys.data.table_piano[i]["name"];
        let note_name_letter_only = note_name.replace(/[0-9]/g, '');

        let piano_key_div = document.createElement("div");
        let is_natural = note_name.indexOf("#") == -1;
        if (is_natural) {
            let piano_key_label_div = document.createElement("div");
            piano_key_label_div.classList.add("key-label", "noselect");
            piano_key_label_div.innerHTML = note_name + "<br>" + i;
            piano_key_div.appendChild(piano_key_label_div);

            piano_key_div.style.width = natural_width + "%"
            piano_key_div.style.left = natural_display_index * natural_width + "%";
            piano_key_div.classList.add("key", "natural");
            natural_display_index++;
        } else {
            piano_key_div.style.width = sharp_width + "%";
            piano_key_div.style.left = natural_display_index * natural_width - (sharp_width * 0.5) + "%";
            piano_key_div.classList.add("key", "sharp");
        }
        piano_key_div.classList.add(note_name_letter_only);

        // add empty div of class 'key-gradient' to each piano key div
        // let piano_key_gradient_div = document.createElement("div");
        // piano_key_gradient_div.classList.add("key-gradient");
        // piano_key_div.appendChild(piano_key_gradient_div);

        // if key-pick-on-hover is checked, set the root note to the hovered note
        piano_key_div.addEventListener("mouseover", function() {
            // get the note name of the hovered key
            let key_pick_on_hover = document.getElementById("key-pick-on-hover").checked;
            if (key_pick_on_hover) {
                let root_note_input = document.getElementById("key-root-note");
                root_note_input.value = note_name_letter_only;
                root_note_input.dispatchEvent(new Event("change"));
            }
        });

        // update note details when clicking on a key.
        piano_key_div.addEventListener("click", function() {
            window.keykeys.data.last_note_name = note_name;
            window.keykeys.fun.updateNoteDetails(note_name);
        });

        piano_div.appendChild(piano_key_div);
    }
}

window.keykeys.fun.createPianoBasedOnSettings = function() {
    let piano_start_note_input = document.getElementById("piano-start-note");
    let piano_start_octave_input = document.getElementById("piano-start-octave");
    let piano_key_count_input = document.getElementById("piano-key-count");
    
    let piano_start_note = piano_start_note_input.value;
    let piano_start_octave = parseInt(piano_start_octave_input.value);
    let piano_key_count = parseInt(piano_key_count_input.value);
    
    window.keykeys.fun.createPiano(piano_start_note, piano_start_octave, piano_key_count);
}  

// used in calculating the visual width of piano key divs
window.keykeys.fun.countNumberOfNaturalAndSharpNotesFromNote = function(note_name, note_num, num_notes) {
    let note_names = window.keykeys.data.note_names;
    let num_natural_notes = 0;
    let num_sharp_notes = 0;
    for( let i = 0; i < num_notes; i++ ) {
        if( note_num + i > 107 ) {
            break;
        }
        let note_name_index = note_names.indexOf(note_name);
        let note_name_index_plus_i = (note_name_index + i) % 12;
        let note_name_plus_i = note_names[note_name_index_plus_i];
        if (note_name_plus_i.indexOf("#") == -1) {
            num_natural_notes++;
        } else {
            num_sharp_notes++;
        }
    }
    return [num_natural_notes, num_sharp_notes];
}

// used once when generating tables, after which the tables are used
window.keykeys.fun.getNoteNameFromPianoKeyNumber = function(piano_key) {
    let note_names = window.keykeys.data.note_names;
    
    // piano_key of 1 is A0, so the index into note_names for any given piano_key is (piano_key - 1) % 12
    let note_name = note_names[(piano_key - 1) % 12];

    // while the piano starts at A0, C1 starts three notes above, and thereafter octaves begin on C.
    // the algorithm for the octave is (piano_key - 4) / 12, rounded down + 1
    return note_name + (Math.floor((piano_key - 4) / 12) + 1);
}

window.keykeys.fun.generateDataTables = function(midi_start, midi_end) {
    let table_midi = {};
    let table_piano = {};
    let table_name = {};
    let table_freq = {};

    // fill each table with midi note num, piano key num, note name, and frequency
    // the data is the same, but the tables are hashable by the different values
    for (let midi_num = midi_start; midi_num <= midi_end; midi_num++) {
        let piano_num = midi_num - 20;
        let note_name = window.keykeys.fun.getNoteNameFromPianoKeyNumber(piano_num);
        let freq = 440 * Math.pow(2, (piano_num - 49) / 12); // 49 is the piano key number for A4, 440Hz

        let note_data = {
            "midi": midi_num,
            "piano": piano_num,
            "name": note_name,
            "freq": freq
        };

        table_midi[midi_num] = note_data;
        table_piano[piano_num] = note_data;
        table_name[note_name] = note_data;
        table_freq[freq] = note_data; // honestly, unsure if rounding errors will interfere with this
    }

    window.keykeys.data.table_midi = table_midi;
    window.keykeys.data.table_piano = table_piano;
    window.keykeys.data.table_name = table_name;
    window.keykeys.data.table_freq = table_freq;
}
