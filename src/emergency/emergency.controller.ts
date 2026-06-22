// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Query,
//   Res
// } from '@nestjs/common';
// import type { Response } from 'express';
// import { EmergencyService } from './emergency.service';
// import * as CryptoJS from 'crypto-js';
// import { supabase } from '../config/supa.config';
// @Controller('emergency')
// export class EmergencyController {

//   constructor(
//     private readonly emergencyService: EmergencyService
//   ) {}

//   @Post('alert')
//   async sendEmergencyAlert(
//     @Body() body: any
//   ) {
//     return this.emergencyService.handleAlert(body);
//   }

//   @Get('view/:id')
//   showDecryptPage(
//     @Param('id') id: string,
//     @Res() res: Response
//   ) {

//     res.send(`
// <!DOCTYPE html>
// <html>

// <head>

// <title>Emergency File</title>

// <style>

// body{
// display:flex;
// justify-content:center;
// align-items:center;
// height:100vh;
// background:#f5f5f5;
// font-family:sans-serif;
// }

// .card{
// background:white;
// padding:30px;
// width:320px;
// border-radius:15px;
// box-shadow:0 2px 10px rgba(0,0,0,0.2);
// text-align:center;
// }

// input{
// width:100%;
// padding:12px;
// margin-top:15px;
// border:1px solid #ccc;
// border-radius:8px;
// }

// button{
// margin-top:20px;
// padding:12px;
// width:100%;
// background:red;
// color:white;
// border:none;
// border-radius:8px;
// cursor:pointer;
// }

// </style>

// </head>

// <body>

// <div class="card">

// <h2>
// 🚨 Emergency File
// </h2>

// <p>
// Enter your decrypt key
// </p>

// <input
// id="key"
// placeholder="Enter key"
// />

// <button onclick="openImage()">
// Open Image
// </button>

// </div>

// <script>

// function openImage(){

// const key =
// document.getElementById("key").value;

// window.location.href =
// "/emergency/decrypt/${id}?key="
// +
// encodeURIComponent(key);

// }

// </script>

// </body>

// </html>
// `);

//   }


//  @Get('decrypt/:id')
// async decryptImage(
//   @Param('id') id: string,
//   @Query('key') key: string,
//   @Res() res: Response
// ) {

//   const data =
//     this.emergencyService.getEmergencyData(id);

//   if (!data) {

//     return res.send(
//       'Invalid emergency id'
//     );

//   }

//   try {

//     const { data: fileData, error }
//       = await supabase.storage
//       .from('encrypted-videos')
//       .download(data.fileName);

//     if (error)
//       throw error;

//     const encryptedText =
//       await fileData.text();

//     const bytes =
//       CryptoJS.AES.decrypt(
//         encryptedText,
//         key
//       );

//     const base64 =
//       bytes.toString(
//         CryptoJS.enc.Utf8
//       );

//     if (!base64) {

//       return res.send(
//         'Wrong key'
//       );

//     }

//     res.send(`
//       <html>

//       <body
//       style="
//       display:flex;
//       justify-content:center;
//       align-items:center;
//       height:100vh;
//       ">

//       <img
//       src="data:image/jpeg;base64,${base64}"
//       width="400"
//       />

//       </body>

//       </html>
//     `);

//   } catch (err) {

//     console.log(err);

//     res.send(
//       'Unable to decrypt image'
//     );

//   }

// }
// }







import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Res
} from '@nestjs/common';
import type { Response } from 'express';
import { EmergencyService } from './emergency.service';
import * as CryptoJS from 'crypto-js';
import { supabase } from '../config/supa.config';

@Controller('emergency')
export class EmergencyController {

  constructor(
    private readonly emergencyService: EmergencyService
  ) {}

  @Post('alert')
  async sendEmergencyAlert(
    @Body() body: any
  ) {
    return this.emergencyService.handleAlert(body);
  }

  @Get('view/:id')
  showDecryptPage(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Emergency File</title>
<style>
body{
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#f5f5f5;
font-family:sans-serif;
}
.card{
background:white;
padding:30px;
width:320px;
border-radius:15px;
box-shadow:0 2px 10px rgba(0,0,0,0.2);
text-align:center;
}
input{
width:100%;
padding:12px;
margin-top:15px;
border:1px solid #ccc;
border-radius:8px;
box-sizing: border-box;
}
button{
margin-top:20px;
padding:12px;
width:100%;
background:red;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
font-weight: bold;
}
</style>
</head>
<body>

<div class="card">
  <h2>🚨 Emergency File</h2>
  <p>Enter your decrypt key</p>
  <input id="key" type="password" placeholder="Enter key" />
  <button onclick="openFile()">Open File</button>
</div>

<script>
function openFile(){
  const key = document.getElementById("key").value;
  window.location.href = "/emergency/decrypt/${id}?key=" + encodeURIComponent(key);
}
</script>

</body>
</html>
`);
  }

  @Get('decrypt/:id')
  async decryptFile(
    @Param('id') id: string,
    @Query('key') key: string,
    @Res() res: Response
  ) {

    const data = this.emergencyService.getEmergencyData(id);

    if (!data) {
      return res.send('Invalid emergency id');
    }

    try {
      const { data: fileData, error } = await supabase.storage
        .from('encrypted-videos')
        .download(data.fileName);

      if (error) throw error;

      const encryptedText = await fileData.text();
      const MASTER_KEY = 'my-secret-123'; 
      let dynamicAesKey = data.aesKey;

      // Smart dynamic parsing block for Master key vs raw key verification
      try {
        const decryptedKeyBytes = CryptoJS.AES.decrypt(data.aesKey, MASTER_KEY);
        const decryptedKeyStr = decryptedKeyBytes.toString(CryptoJS.enc.Utf8);
        if (decryptedKeyStr && decryptedKeyStr.length > 0) {
          dynamicAesKey = decryptedKeyStr; 
        }
      } catch (e) {
        dynamicAesKey = data.aesKey;
      }

      const bytes = CryptoJS.AES.decrypt(
        encryptedText,
        dynamicAesKey
      );

      const base64 = bytes.toString(CryptoJS.enc.Utf8);

      if (!base64) {
        return res.send('Wrong key');
      }

      const lowerFileName = data.fileName.toLowerCase();
      let mediaHtml = '';

      // 🔥 FIXED COMPATIBILITY BLOCK FOR AUDIO PLAYBACK
      if (lowerFileName.includes('audio/') || lowerFileName.endsWith('.wav') || lowerFileName.endsWith('.mp3') || data.fileType === 'audio') {
        mediaHtml = `
          <h3>🎵 Decrypted Audio Evidence</h3>
          <p style="color: #555; font-size: 14px;">Playing recorded voice stream file</p>
          
          <audio controls autoplay style="width: 100%; max-width: 400px; margin-top: 20px;">
            <source src="data:audio/wav;base64,${base64}" type="audio/wav">
            Your browser does not support the audio element.
          </audio>
        `;
      } else {
        // 📸 IMAGE TEMPLATE (Stays completely intact)
        mediaHtml = `
          <h3>📸 Decrypted Image Evidence</h3>
          <img src="data:image/jpeg;base64,${base64}" width="400" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
        `;
      }

      res.send(`
        <html>
        <head>
          <title>Decrypted Media</title>
        </head>
        <body style="
          display:flex;
          flex-direction: column;
          justify-content:center;
          align-items:center;
          height:100vh;
          background: #f0f2f5;
          font-family: sans-serif;
        ">
          ${mediaHtml}
          <br/>
          <a href="/emergency/view/${id}" style="color: red; text-decoration: none; font-weight: bold; margin-top: 20px;">← Back</a>
        </body>
        </html>
      `);

    } catch (err) {
      console.log(err);
      res.send('Unable to decrypt file');
    }
  }
}