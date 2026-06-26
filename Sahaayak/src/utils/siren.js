import Sound from 'react-native-sound';

Sound.setCategory('Playback', true); 

let siren = null;

const initSiren = () => {
  if (!siren) {
    siren = new Sound('police_siren.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('❌ Error loading siren file:', error);
        return;
      }
      console.log('✅ Siren file loaded successfully');
      siren.setNumberOfLoops(-1); 
      siren.setVolume(1.0);       // Full volume
    });
  }
};

initSiren();

export const playSiren = () => {
  console.log("🔊 Trying to play siren...");
  
  if (!siren) {
    siren = new Sound('police_siren.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('❌ Error loading siren:', error);
        return;
      }
      siren.setNumberOfLoops(-1);
      siren.play((success) => {
        if (!success) console.log('❌ Playback failed');
      });
    });
    return;
  }

  siren.play((success) => {
    if (!success) {
      console.log('❌ Playback failed or interrupted');
    }
  });
};

export const stopSiren = () => {
  if (siren) {
    siren.stop(() => {
      console.log('🔇 Siren stopped');
    });
  }
};