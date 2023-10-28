var audioCtx; 
var brownNoise;
const brookButton = document.getElementById("brookButton");

brookButton.addEventListener("click", function() {

    if(!audioCtx) {
        initAudio();
        return;
	}

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }

}, false);

function createBrownSound(aCtx) {
    var bufferSize = 10 * aCtx.sampleRate,
    noiseBuffer = aCtx.createBuffer(1, bufferSize, aCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;
    
        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = aCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);
    
    return brownNoise
}


let initAudio = function () {
    audioCtx = new AudioContext();
	globalGain = audioCtx.createGain();
	globalGain.gain.value = 0.1;
	globalGain.connect(audioCtx.destination);

	var lpf1 = audioCtx.createBiquadFilter();
	lpf1.type = "lowpass";
	lpf1.frequency.value = 400;

	var lpf2 = audioCtx.createBiquadFilter();
	lpf2.type = "lowpass";
	lpf2.frequency.value = 14;

	var rhpf = audioCtx.createBiquadFilter();
	rhpf.type = "highpass";
	rhpf.Q.value = 33.33;
	rhpf.frequency.value = 500;

	var gain1 = audioCtx.createGain();
	gain1.gain.value = 1500;

	var brownNoise1 = createBrownSound(audioCtx);
	var brownNoise2 = createBrownSound(audioCtx);
	
	brownNoise2.connect(lpf2).connect(gain1).connect(rhpf.frequency);
	brownNoise1.connect(lpf1).connect(rhpf).connect(globalGain);

    clockSound = createClockSound(audioCtx);
    clockSound.connect(globalGain)
    

}

let initAudioClock = function () {
    if(!audioCtx) {
        audioCtx = new AudioContext();
    }
    globalGain = audioCtx.createGain();


}

const clockButton = document.getElementById("clockButton");

clockButton.addEventListener("click", function() {
    playClockSound();
})

function createClockSound(aCtx) {
    //  possibly change buffer size 
    var clockBuffer = aCtx.createBuffer(1, aCtx.sampleRate, aCtx.sampleRate);
    var output = tickBuffer.getChannelData(0);

    for (var i = 0; i < clockBuffer.length; i++) {
        output[i] = (i%2 ===0) ? 1 : -1;
    }

    clockSound = aCtx.createBufferSource;
    clockSound.buffer = clockBuffer;

    return clockSound; 
}

setInterval(function() {
    clockSound.start()
}, 1000)


// const bowlButton = document.getElementById("bowlButton");

// bowlButton.addEventListener("click", function() {
//     playTibetanBowlSound();
// })

// function createTibetanBowlSound(aCtx) {
//     const sampleRate = aCtx.sampleRate
//     var numFrames = 5 * sampleRate;
//     const buffer = aCtx.createBuffer(1, numFrames, sampleRate);
//     const data = buffer.getChannelData(0);

//     const baseFreq = 440; // adjust for pitch 

//     const malletNumFrames = 0.2 * sampleRate 
    

//     for (let i = 0; i < numFrames; i++) {
//         var t = i / sampleRate; 
//         let combinedWave = 0; 

//         for (let harmonic = 1; harmonic <= 5; harmonic++) {
//             const freq = baseFreq * harmonic; 
//             const amp = 1 / Math.pow(harmonic, 6)
//             combinedWave += amp * Math.sin (2 * Math.PI * freq * t);
//         }
    

//         // if (i < malletNumFrames) { // initial mallet strike
//         //     // attack 
//         //     if ( i < attackFrames) {
//         //         const attackAmp = (i / attackFrames);
//         //         combinedWave = attackAmp * Math.sin(2 * Math.PI * baseFreq * t);
//         //     }

//         //     // decay
//         //     else if (i < (attackFrames + decayFrames)) {
//         //         const decayAmp = sustainAmp - (sustainAmp * (i-(attackFrames + sustainFrames)/decayFrames))
//         //         combinedWave = decayAmp * Math.sin(2 * Math.PI * baseFreq * t);
//         //     }
//         //     // sustain 
//         //     else {
//         //         combinedWave = sustainAmp * Math.sin(2 * Math.PI * baseFreq * t);
//         //     }

//         //     // const malletAmplitude = 1 -(i/malletNumFrames);
//         //     // combinedWave = malletAmplitude * Math.sin(2 * Math.PI * baseFreq * t)
//         // } else { // resonance following mallet strike 
//         //     for (let harmonic = 1; harmonic <= 5; harmonic++) {
//         //         const freq = baseFreq * harmonic; 
//         //         const amp = sustainAmp / Math.pow(harmonic, 6)
//         //         combinedWave += amp * Math.sin (2 * Math.PI * freq * t);
//         //     }
//         // }

//         data[i] = combinedWave; // mb can adjust loudness
//     }

//     bowlSource = aCtx.createBufferSource();
//     bowlSource.buffer = buffer;

//     const gainNode = aCtx.createGain();

//     bowlSource.connect(gainNode);
//     gainNode.connect(aCtx.destination);

//     bowlSource.start(0);

//     // attack
//     gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime)
//     // decay 
//     gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, 0.1)
//     // sustain 
//     gainNode.gain.setTargetAtTime(0.4, audioCtx.currentTime + 0.2, 0.2)

//     // release
//     gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, gainRelease);


//     return bowlSource; 
// }

// function playTibetanBowlSound() {
//     audioCtx = new AudioContext();
//     // globalGain = audioCtx.createGain();
// 	// globalGain.gain.value = 0.3;
// 	// globalGain.connect(audioCtx.destination);

//     var bowlBuffer = createTibetanBowlSound(audioCtx);
    
//     // bowlBuffer.connect(globalGain);

// }

