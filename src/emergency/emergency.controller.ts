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
}

</style>

</head>

<body>

<div class="card">

<h2>
🚨 Emergency File
</h2>

<p>
Enter your decrypt key
</p>

<input
id="key"
placeholder="Enter key"
/>

<button onclick="openImage()">
Open Image
</button>

</div>

<script>

function openImage(){

const key =
document.getElementById("key").value;

window.location.href =
"/emergency/decrypt/${id}?key="
+
encodeURIComponent(key);

}

</script>

</body>

</html>
`);

  }

 @Get('decrypt/:id')
async decryptImage(
  @Param('id') id: string,
  @Query('key') key: string,
  @Res() res: Response
) {

  const data =
    this.emergencyService.getEmergencyData(id);

  if (!data) {

    return res.send(
      'Invalid emergency id'
    );

  }

  try {

    const { data: fileData, error }
      = await supabase.storage
      .from('encrypted-videos')
      .download(data.fileName);

    if (error)
      throw error;

    const encryptedText =
      await fileData.text();

    const bytes =
      CryptoJS.AES.decrypt(
        encryptedText,
        key
      );

    const base64 =
      bytes.toString(
        CryptoJS.enc.Utf8
      );

    if (!base64) {

      return res.send(
        'Wrong key'
      );

    }

    res.send(`
      <html>

      <body
      style="
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
      ">

      <img
      src="data:image/jpeg;base64,${base64}"
      width="400"
      />

      </body>

      </html>
    `);

  } catch (err) {

    console.log(err);

    res.send(
      'Unable to decrypt image'
    );

  }

}
}