# buildops-test

// run
cmd git clone https://github.com/Pachiyappan/buildops-test
cmd: npm install 
cmd: npm start

/**************************** server ***************************************/

cmd: npm install -g @aws-amplify/cli

cmd: amplify configure

choose the region

given the username: just like amplify-cli-us-west-2-user or something
// IAM console will open

click "nexpermission" => "nexttag" => "next: review" => "create user" then

you will get access key and secret access key and then paste the key in Appropriate place 

afterward given the "profile name" for new user

/*************************************************************/

/* client Side */

cmd:  npx create-react-app my-app

cmd: amplify init

choose your editor, type of app building, enviroment name, framework, directory path, source directory path, ditribution directory path,
build command and start command

then

do you want to use an aws profile? ans: yes
choose the profile which you created


cmd: amplify add api

choose "graphql"


Please select from one of the below mentioned services: GraphQL
? Provide API name: client
? Choose the default authorization type for the API API key
? Enter a description for the API key: 
? After how many days from now the API key should expire (1-365): 7
? Do you want to configure advanced settings for the GraphQL API No, I am done.
? Do you have an annotated GraphQL schema? No
? Do you want a guided schema creation? Yes
? What best describes your project: Single object with fields (e.g., “Todo” with ID, name, description)
? Do you want to edit the schema now? (Y/n) y

create a schema and save

then 

cmd: amplify push
 will build all your local backend resources and provision it in the cloud

cmd: amplify publish
 will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud 

after amplify push cmd given, you receive this message "GraphQL schema compiled successfully"


GraphQL endpoint:  https://yc7soabqqzhlpk6u6f2ygloqde.appsync-api.ap-south-1.amazonaws.com/graphql
GraphQL API KEY: da2-ci5czua2oje7hir7pgkp3x5exm

lets go to see the appsync in aws console
your api card show on there and try the queries

let we go to next,

cmd: npm add aws-amplify

cmd: npm i @apollo/react-hooks

cmd: npm i graphql 

cmd: npm i graphql-tag  

cmd: npm i apollo-link-context

cmd: npm i apollo-cache-inmemory

cmd: npm i apollo-link-http

cmd: npm i apollo-client

cmd: npm i react-apollo

Thank You.... !
