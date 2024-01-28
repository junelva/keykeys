// keykeys main.js

window.onload = function () {
    // populate data tables from midi note 0 to 127; 21-108 is A0 to C8 (88 keys on a piano)
    window.keykeys.fun.generateDataTables(0, 127);
    window.keykeys.fun.createDynamicSelectors();
    window.keykeys.fun.createPianoBasedOnSettings();
    window.keykeys.fun.createSettingsCallbacks();
    window.keykeys.fun.refreshHighlight();
}

