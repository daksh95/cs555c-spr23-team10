import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import create_user from '../data_handler/create_user.js';
import create_project from '../data_handler/create_p.js';
import create_chat from '../data_handler/create_chat.js';

const statusMap = {
  0: {status: "Created", next: "manager"},
  1: {status: "Engineering", next: "engineer"},
  2: {status: "Pending Manager Review", next: "manager"},
  3: {status: "Finished (Customer Review)", next: "customer"},
  4: {status: "Finished"}
}

const db = await dbConnection();
await db.dropDatabase();

const projects = [{
  "name": "Second Solar Project",
  "customer": "640662bffb5bcdd8be16eeec",
  "description": "This is another test",
  "statusId": 1,
  "status": "Engineering",
  "propertyAddress": "76 Columbia Ave, Jersey City, NJ 07307",
  "projectSize": 0,
  "images": [],
  "timeline": [
    {
      "statusId": 0,
      "status": "Created",
      "start": "3/11/2023",
      "end": "3/13/2023"
    },
    {
      "statusId": 1,
      "status": "Engineering",
      "start": "3/13/2023"
    }
  ]
}, {
  "name": "My First Solar Project",
  "description": "This is a test solar project",
  "customer": "64067870e6214c945ca16aa4",
  "propertyAddress": "225 South St, Jersey City, NJ 07307",
  "projectSize": 50,
  "statusId": 0,
  "status": "Created",
  "images": [],
  "timeline": [
    {
      "statusId": 0,
      "status": "Created",
      "start": "3/25/2023"
    }
  ]
}, {
  "name": "Test Project Engineering",
  "description": "Test",
  "customer": "64067870e6214c945ca16aa4",
  "propertyAddress": "28 Terrace Ave, Jersey City, NJ 07307",
  "projectSize": 200,
  "statusId": 1,
  "status": "Engineering",
  "images": [],
  "timeline": [
    {
      "statusId": 0,
      "status": "Created",
      "start": "4/1/2023",
      "end": "4/5/2023"
    },
    {
      "statusId": 1,
      "status": "Engineering",
      "start": "4/5/2023"
    }
  ]  
}, {
  "name": "Testing Timeline",
  "description": "This is a test project for checking if the approval workflow and timeline feature works",
  "customer": "64234c5399eab4e3d3ed542e",
  "manager": "64234c5399eab4e3d3ed542d",
  "propertyAddress": "Just some random address",
  "projectSize": "100",
  "statusId": 4,
  "status": "Finished",
  "images": [
    "\\uploads\\projectUpdate-1682428936685.jpeg"
  ],
  "timeline": [
    {
      "statusId": 0,
      "status": "Created",
      "start": "4/10/2023",
      "end": "4/11/2023"
    },
    {
      "statusId": 1,
      "status": "Engineering",
      "start": "4/11/2023",
      "end": "4/13/2023"
    },
    {
      "statusId": 2,
      "status": "Pending Manager Review",
      "start": "4/16/2023",
      "end": "4/17/2023"
    },
    {
      "statusId": 3,
      "status": "Finished (Customer Review)",
      "start": "4/17/2023",
      "end": "4/25/2023"
    },
    {
      "statusId": 4,
      "status": "Finished",
      "start": "4/25/2023"
    }
  ]
}];

const users = [{
  "id": 13.127591071439415,
  "name": "sales member 1",
  "email": "sales1@solar.com",
  "password": "$2b$10$gIyjvF3yfQtkt0SpL1.EnOt0ovHiSSp2Aaz7dKs7hYHlwNM3.otwy",
  "pwd_text": "sales1",
  "type": "sales"
}, {
  "id": 64.10064100905456,
  "name": "sales member 2",
  "email": "sales2@solar.com",
  "password": "$2b$10$.tv8Pdla5CZamRwuSNz2dOop9K01.JjcEc3H4DNQ9aOm5/LGtKZJK",
  "pwd_text": "sales2",
  "type": "sales"
}, {
  "id": 35.76113358972557,
  "name": "Daksh",
  "email": "daksh@solar.com",
  "password": "$2b$10$PYy2GdZK7Z9TqLB3aUs9Lu3Ns071.7VBRcXt/3W2spZIwlzjPDWh2",
  "pwd_text": "12345678",
  "type": "engineer"
}, {
  "id": 17.071864332182287,
  "name": "Atul Gupta",
  "email": "atul@solar.com",
  "password": "$2b$10$bLw0bOTmRDbCY4wJPUNjJ.UYmis9s3ezNNbJsaxvp4s1w8RCmoBum",
  "pwd_text": "12345678",
  "type": "manager"
}, {
  "id": 4.593411873522224,
  "name": "Shrey Tanna",
  "email": "shrey@solar.com",
  "password": "$2b$10$.lxHayKt4i.A1M0r6CEB9.1o62orY1CLIqaSISx5DG9yvnb/oxhg.",
  "pwd_text": "12345678",
  "phone": "3476350094",
  "type": "customer"
}, {
  "id": 10.477316131901858,
  "name": "Riddhi Dange",
  "email": "riddhi@solar.com",
  "password": "$2b$10$8debIwXEdFiUa/4Gjl77L.oAKCJdhJKk9i7rqpAkdtyvZbPyLVb2q",
  "pwd_text": "12345678",
  "phone": "3476350094",
  "type": "customer"
}];

let userObj = undefined;
let id_list = [];
let support_list = [];
let chat_list = [];
let manager_list = [];

for (let user of users) {
  if (user.type === "sales") {
    userObj = await create_user(user);
    support_list.push({name:user.name,id:userObj.insertedId.toString()});
    continue
  }
  if (user.type === "customer") {
    let s = support_list[Math.floor(Math.random() * 2)]
    userObj = await create_user(user);
    id_list.push(userObj.insertedId.toString());
    chat_list.push({support_name:s.name,support_id:s.id,customer:userObj.insertedId.toString()})
    continue
  }
  if (user.type === "manager") {
    userObj = await create_user(user);
    manager_list.push(userObj.insertedId.toString());
  }
  userObj = await create_user(user);
}

const cust_count = id_list.length;
const manager_count = manager_list.length;

for (let i in projects) {
  projects[i].customer = id_list[i % cust_count];
  projects[i].manager = manager_list[i % manager_count];
  await create_project(projects[i]);
}

for (let c of chat_list){
  c.messages = ["S-Hey how can I help You","C-I had a problem with the status of the project"]
  c.new_messages = []
  await create_chat(c)
}

await closeConnection();