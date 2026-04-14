import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // URL do seu servidor gringo ou do seu site no GitHub
  const movieUrl = "https://vidsrc.to/embed/movie/550"; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: movieUrl }}
          style={styles.video}
          // ESSA LINHA DESATIVA O ERRO DE SANDBOXING
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // ESSA LINHA RESOLVE O MEDIA UNAVAILABLE (Engana o servidor)
          userAgent="Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36"
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true}
          // Remove restrições de origem
          originWhitelist={['*']}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
});
