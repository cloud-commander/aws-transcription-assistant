
## AWS Transcription Assistant

I am very excited to share with you a project I have been working on that makes it easy for you to transcribe an audio file into text,  live edit that transcript and then save it into a format of your choice such as a Word document. 

The application has been built as a *Progressive Web App (PWA)* using the React framework and as you might have guessed already, it makes use of AWS services.

### Solution Architecture
![Solution Architecture](https://raw.githubusercontent.com/cloud-commander/aws-transcription-assistant/master/aws-transcription-assistant-architecture-diagram.png)

So at a high level this is what is going on:

 - User makes a request to the Transcription Assistant domain (it would first hit Route 53 but that isnt reflected in the above diagram)
 - Authentication against Cognito must take place
 - Once authenticated, Cloudfront (which gets its content from S3) delivered the React PWA to the browser
 - User attempts to upload an audio file, but before that can happen, an upload token must be obtained
 - With the upload token available, the client can then upload the audio file to S3 (user must choose how many speakers are in the audio clip, this information is then encoded within the audio filename)
 - The upload event triggers a Lambda function which inserts a new record in a DynamoDB table and publishes an SNS message
 - The SNS message triggers a Lambda function which submits a Transcribe service job
 - When the Transcription is complete, its stored in an S3 bucket
 - When the user attempts to refresh the recordings table, that triggers a Lambda function which checks the transcription job status and updates the DynamoDB table accordingly
 - If the transcription is complete, it is displayed in the interface and the user can play it back
 - The interface allows the user to follow the transcription live as it synchronises the text with the audio being spoken
 - The user has the option to edit the text and then download it if desired

User makes a re

### Install Guide

So, how do you get this code running on your own AWS account?

#### Cognito Authentication

Firstly, we need to sort out the userpool that Cognito will authenticate against.

Make sure you have the AWS CLI installed.

You have the option to:

 - [Configure Cognito on the AWS Console](https://docs.aws.amazon.com/cognito/latest/developerguide/getting-started-with-cognito-user-pools.html)
 - Use [AWS Amplify](https://aws.amazon.com/blogs/mobile/amplify-cli-enables-creating-amazon-cognito-user-pool-groups-configuring-fine-grained-permissions-on-groups-and-adding-user-management-capabilities-to-applications/)
 - Use CDK

For this example, I am going to use CDK:

1.    `git clone https://github.com/full-stack-serverless/cdk-authentication.git`
2.    `cd cdk-authentication` 
3.    `npm install`
4.    `cdk deploy`

Once the project has been deployed, you'll be given the resources needed to configure the client-side React application.

    Outputs:
    CdkAppsyncChatStack.UserPoolClientId = your_userpool_client_id
    CdkAppsyncChatStack.UserPoolId = us-east-1_your_userpool_id

#### Deploying AWS Transcription Assistant application

Start by cloning the Github repo

    git clone https://github.com/cloud-commander/aws-transcription-assistant.git

Then navigate to the `aws-transcription-assistant/packages/frontend/src/`
and edit `aws-exports-sample.js` by entering the details you obtained from the first step and saving it as `aws-exports.js`

Now you can deploy the CDK stack. Go back to the top folder `aws-transcription-assistant/`

 - Run `yarn` to install all dependencies.
- Run `yarn build` to build both front end and back end.
- Run `yarn bootstrap` to initialise AWS CDK deployment.
- Run `yarn deploy` to do the actual deployment.

 If the deployment is successful, you should see the Cloudfront URL it was deployed at.

You now have the choice to put that behind a domain name with Route 53 like I have, or leave it as is.

### Quick Overview

Lets quickly run through the app

#### Cognito Login Page
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture.PNG)

#### Home Page
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture2.PNG)

#### Search for transcriptions
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture3.PNG)

#### Viewing a transcription
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture4.PNG)

#### Transcription playback
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture5.PNG)

#### Export Transcription
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture6.PNG)

#### Exported Transcription
![Cognito Login](https://github.com/cloud-commander/aws-transcription-assistant/raw/master/screenshots/Capture7.PNG)
