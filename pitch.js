function midiToFreq(n){

return 440*Math.pow(2,(n-69)/12)

}

function calcCent(inputFreq, targetMidi){

let target = midiToFreq(targetMidi)

let cent = 1200*Math.log2(inputFreq/target)

return Math.round(cent)

}
