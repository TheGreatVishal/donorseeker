
# To check malicious activites
1. cuckoo sendbox
2. any.run
3. virustotal

# Locked buffer (thread spin) : at server we will use it for testing the input to make our server safe....
    -> Payload 

-------------------------------------------------------------------------------
# Sign Up mechanism

1. user will come to sign up page 
2. they will enter username, when user will move to other field to enter data we will check if username is unique or not, if unique it's good otherwise we will show red colored msg just beneath the username field that username already exist...
3. then for email, they will enter email, there is send otp button with this email field, before sending otp to this email first we will check if the email format is correct or not, then we will send otp to this email and also we will store this otp to our database with this email-id so that we can verify it when user provides the received otp at their email
4. then they will enter password and confirm password which should be same.
5. then they will enter their contact number whose length should be 7 to 15 
6. now there is sign up as admin option, if user wants to sign up as admin they will toogle on this button and they should have admin key after entering admin key, they will press verify admin key and it will be verified using api, if its correct then user can sign up as admin and in table of user isadmin will be true other wise wrong admin key message will appear or they can sign up as normal user
7. now they will press create account button to create account 
-------------------------------------------------------------------------------

# Forget Password Mechanism

1. new page for forgot password
2. that page will ask to prompt email-id and there is send otp button just right side of email id field.
3. when we press send otp, first we will check if  the email id is registered in database or not, if emial id is registered only then we will send otp to that email id and we will also save that otp to our database table  otpverification with that email id. (create api for this)
4. there is button called "verify otp" (api to verify otp is already created which takes email and otp as input), system will check if entered otp is same as otp in database or not, if not then message will be shown invalid otp else if otp is  correct then option will come for  new password and confirm password and a button "update password" and message for successful updation of password and will be redirected to login page.





-------------------------------------------------------------------------------