let currentNote = null

async function connectMIDI(){

let midi = await navigator.requestMIDIAccess()

for(let input of midi.inputs.values()){
input.onmidimessage = onMIDI
}

}

function onMIDI(msg){

let [cmd,note,val] = msg.data

let type = cmd & 0xf0

if(type===144 && val>0){

currentNote = note
playNote(note)
updateNote(note)

}

if(type===128){

stopNote(note)

}

if(type===176){

let cc = note

if(cc===2){

let breath = val/127

setBreath(breath)

document.getElementById("breath").style.width=(breath*100)+"%"

}

}

}
