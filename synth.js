let synth
let gainNode
let reverb

async function initSynth(){

await Tone.start()

gainNode = new Tone.Gain(0.5).toDestination()

reverb = new Tone.Reverb({
decay:3,
wet:0.4
}).connect(gainNode)

synth = new Tone.Sampler({
urls:{
C4:"C4.mp3",
D#4:"Ds4.mp3",
F#4:"Fs4.mp3",
A4:"A4.mp3"
},
baseUrl:"soundfont/sax/"
}).connect(reverb)

}

function playNote(note){

let freq = Tone.Frequency(note,"midi")

synth.triggerAttack(freq)

}

function stopNote(note){

let freq = Tone.Frequency(note,"midi")

synth.triggerRelease(freq)

}

function setBreath(v){

gainNode.gain.value = v

}
