var audioCtx; 
const watchButton = document.getElementById("watchButton");

watchButton.addEventListener("click", function() {

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

function createWhiteNoise() {
    const bufferSize = 10 * audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1; // Generate random values between -1 and 1
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;    
    return whiteNoise;
}

function createEnvelope(decayTime) {
    decayTime = decayTime/1000
    const now = audioCtx.currentTime;
    const envelope = audioCtx.createGain();
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(1, now + 0.001); //attack
    envelope.gain.setTargetAtTime(0.01, now + 0.001, decayTime); //decay

    return envelope;
}

function triggerTick() {
    var whiteNoise = createWhiteNoise();

    const filterFreqs = [Math.random() * 800 + 4000, 7000- Math.random() * 600, Math.random() * 800 + 6000];
    const decays = [Math.random() * 8 + 3, Math.random() * 25 + 15, 28 - Math.random() * 7]

    for (var i = 0; i<filterFreqs.length; i++) {
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass'
        filter.frequency.value = filterFreqs[i];
        filter.Q.value = 30; 

        const envelope = createEnvelope(decays[i]);

        whiteNoise.connect(filter).connect(envelope).connect(audioCtx.destination);
    }

    whiteNoise.start();
    whiteNoise.stop(audioCtx.currentTime + 0.04);
}


let initAudio = function () {
    audioCtx = new AudioContext();
	setInterval(triggerTick, 250);
}