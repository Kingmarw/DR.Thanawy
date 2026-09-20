// Usepresssound.js
import * as Tone from 'tone';

// سينث واحد بس بيتعمل مرة واحدة لكل الصفحة (مش كل ضغطة) عشان الأداء
let clickSynth = null;

function getClickSynth() {
    if (!clickSynth) {
        clickSynth = new Tone.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
        }).toDestination();
        clickSynth.volume.value = -12; // خافت شوية عشان مايبقاش مزعج
    }
    return clickSynth;
}

/**
 * usePressSound - هوك مشترك لأي عنصر قابل للضغط (زرار، كارت، أيقونة...)
 * بيرجّع دالة واحدة بتشغّل صوت "طقة" خفيفة عند الضغط.
 *
 * @param {string} note - النغمة اللي هتتشغل، افتراضيًا C6
 */
export function usePressSound(note = 'C6') {
    return async function playPressSound() {
        try {
            // المتصفحات بتمنع تشغيل الصوت قبل أول تفاعل من المستخدم，
            // فـ Tone.start() هنا بتتأكد إن الـ AudioContext شغّال (الضغطة نفسها هي التفاعل)
            await Tone.start();
            getClickSynth().triggerAttackRelease(note, '32n');
        } catch (e) {
            // لو الصوت فشل لأي سبب، منسيبش العنصر يبوظ
            console.warn('تعذّر تشغيل صوت الضغطة:', e);
        }
    };
}