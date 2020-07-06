# 1-to-1 RTC: A Sample Web App using PHP & EnableX Web Toolkit

The Sample Web App demonstrates the use of APIs for EnableX platform to carry out 1-to-1 RTC (Real Time Communication). The main motivation behind this application is to demonstrate usage of APIs and allow developers to ramp up on app by hosting on their own devices instead of directly using servers.

RTC Applications hosted on EnableX platform run natively on supported set of web browsers without any additional plugin downloads. 

This basic 1-to-1 Video Chat Application is developed using HTML, CSS, Bootstrap, JAVA Script, jQuery, PHP and EnxRtc (The EnableX Web Toolkit). 

>The details of the supported set of web browsers can be found here:
https://developer.enablex.io/release-notes/#cross-compatibility


## 1. Important!

When developing a Client Application with EnxRtc.js make sure to include the updated EnxRtc.js polyfills for RTCPeerConnection and getUserMedia otherwise your application will not work in web browsers.


## 2. Demo (only if you can't get it working below)

Visit Demo Zone (https://portal.enablex.io/demo-zone/) to request a Guided Demo or Demo Access to different type of application available there. 

You may also try our Video Meeting and Webinar solutions here: https://enablex.io/vcfree


## 3. Installation


### 3.1 Pre-Requisites

#### 3.1.1 App Id and App Key 

* Register with EnableX https://portal.enablex.io/trial-sign-up/
* Create your Application
* Get your App ID and App Key delivered to your registered email
* Clone or download this repository `git clone https://github.com/EnableX/One-to-One-Video-Calling-Open-Source-PHP-Application.git`
* You can copy the app into any sub-directory of hosted website on Apache

#### 3.1.2 SSL Certificates

The Application needs to run on https. So, you need to use a valid SSL certificate for your domain and point your application to use them. 

However you may use self-signed Certificate to run this application locally. There are many Web Sites to get a Self-Signed Certificate generated for you, Google it. Few among them are:
* https://letsencrypt.org/
* https://www.sslchecker.com/csr/self_signed
* https://www.akadia.com/services/ssh_test_certificate.html  

Alternatively you can create your self-signed certificate as below 

`sudo openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.crt -days 10000 -nodes`

`sudo mv server.crt /etc/ssl/certs/ssl.crt`

`sudo mv server.key /etc/ssl/private/ssl.key`

Enable mod ssl and turn on ssl server

`sudo a2enmod ssl`

`sudo a2ensite default-ssl`

`sudo service apache2 restart`

#### 3.1.3 Configure

Before you you try accessing the /client folder using browser, configure the API Service by editing `api/config.php` file to use your app ID and app key

``` 
define("API_URL",	"https://api.enablex.io/v1");
define("APP_ID",	"YOUR_APP_ID");	
define("APP_KEY",	"YOUR_APP_KEY");

```

### 3.2 Test you video call

* Open a browser and go to `https://localhost:443/path-to-sample-app/client/`. The browser should load the App. 
* Go to -> Advanced -> Proceed to localhost
* `Don't have a Room ID? Create One` (it creates a new Room ID) and have it pre-filled
* Store the `Room ID` for future use or share it
* Enter a user `Name` (e.g. test0)
* Select `Join as Moderator`
* `Sign In` and allow access to camera and microphone when prompted to start your first webRTC call through EnableX
* Open another browser tab and enter `https://localhost:443/path-to-sample-app/client/`
* Enter the same `Room ID` previously created, add a different user `Name` (e.g. test1) and select `Join as Participant` and click `Sign In`
* Now, you should see your own video in both the tabs!


## 4 Server API

EnableX Server API is a Rest API service meant to be called from Partners' Application Server to provision video enabled 
meeting rooms. API Access is given to each Application through the assigned App ID and App Key. So, the App ID and App Key 
are to be used as Username and Password respectively to pass as HTTP Basic Authentication header to access Server API.
 
For this application, the following Server API calls are used: 
* https://developer.enablex.io/latest/server-api/rooms-route/#get-rooms - To get list of Rooms
* https://developer.enablex.io/latest/server-api/rooms-route/#get-room-info - To get information of the given Room
* https://developer.enablex.io/latest/server-api/rooms-route/#create-token - To create Token for the given Room

To know more about Server API, go to:
https://developer.enablex.io/latest/server-api/

## 5 Client API

Client End Point Application uses Web Toolkit EnxRtc.js to communicate with EnableX Servers to initiate and manage RTC Communications.  

To know more about Client API, go to:
https://developer.enablex.io/latest/client-api/