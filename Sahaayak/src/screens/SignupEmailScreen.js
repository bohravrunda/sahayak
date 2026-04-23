import React,{useState} from 'react';
import {View,Text,TextInput,Button,StyleSheet,Alert} from 'react-native';
import colors from '../styles/colors';
import { signup } from '../api/authApi';

export default function SignupEmailScreen({navigation}){

 const [name,setName]=useState('');
 const [email,setEmail]=useState('');

 const sendOtp = async()=>{
  if(!name||!email) return Alert.alert("All fields required");

  const res = await signup(name,email);

  if(res.ok){
   navigation.navigate("SignupOtp",{email});
  } else{
   Alert.alert("Error",res.message || "Failed to send OTP");
  }
 };

 return(
  <View style={styles.container}>
   <Text style={styles.title}>Create Account</Text>

   <TextInput 
     style={styles.input} 
     placeholder="Full Name" 
     value={name} 
     onChangeText={setName}
   />

   <TextInput 
     style={styles.input} 
     placeholder="Email" 
     value={email} 
     onChangeText={setEmail}
     keyboardType="email-address"
   />

   <Button title="Send OTP" color={colors.primary} onPress={sendOtp}/>
  </View>
 );
}

const styles=StyleSheet.create({
 container:{flex:1,justifyContent:'center',padding:20,backgroundColor:colors.background},
 title:{fontSize:24,fontWeight:'bold',marginBottom:20,color:colors.primary,textAlign:'center'},
 input:{borderWidth:1,borderColor:colors.gray,borderRadius:8,padding:10,marginBottom:20,backgroundColor:colors.white}
});
