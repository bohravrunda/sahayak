import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let siren = null;

export const playSiren = () => {
  console.log("🔊 Trying to play siren...");

  if (siren) {
    siren.stop(() => siren.play());
    return;
  }

  siren = new Sound('police_siren.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('❌ Error loading siren:', error);
      return;
    }

    console.log('✅ Siren loaded');

    siren.setNumberOfLoops(-1); // infinite loop
    siren.play((success) => {
      if (!success) {
        console.log('❌ Playback failed');
      }
    });
  });
};

export const stopSiren = () => {
  if (siren) {
    siren.stop(() => {
      console.log('🔇 Siren stopped');
    });
  }
};