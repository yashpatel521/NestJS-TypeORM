export const userCreate = {
  statusCode: 200,
  success: true,
  data: {
    id: 18,
    email: "yasoddsdh@yash.com",
    name: "yash",
    password: "$2b$12$iCsMSjt27EKnQlFoDVunXe5BN",
    createdAt: "2022-11-14T12:14:00.295Z",
    role: {
      id: 1,
      name: "admin",
      createdAt: "2022-11-14T12:14:00.295Z",
    },
  },
};

export const userList = {
  statusCode: 200,
  succuss: true,
  data: [
    {
      id: 25,
      name: "yash",
      email: "yadsdss@yash.com",
      password: "$2b$12$FQ9GU4y2HTJ/TU8hmJ3Kb.ebRbYazJH67FrfDYwbbKpqn2V8Ye2EC",
      createdAt: "2022-11-14T12:14:00.295Z",
      role: {
        id: 1,
        name: "admin",
        createdAt: "2022-11-14T12:14:00.295Z",
      },
    },
    {
      id: 24,
      name: "yash",
      email: "yash@yash.com",
      password: "$2b$12$iCsMSjt27EKnQlFoDVunXe5BNs9cSKfv9cEfdj6tkiMGIQbrbEx/q",
      createdAt: "2022-11-14T12:14:00.295Z",
      role: {
        id: 1,
        name: "admin",
        createdAt: "2022-11-14T12:14:00.295Z",
      },
    },
  ],
};

export const login = {
  statusCode: 200,
  succuss: true,
  data: {
    id: 6,
    email: "yash@yash.com",
    name: "Yash Patel",
    createdAt: "2022-11-14T12:14:33.035Z",
    role: {
      id: 1,
      name: "admin",
      createdAt: "2022-11-14T12:14:00.295Z",
    },
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjY4NDg3NDc0LCJleHAiOjE2NjkzNTE0NzR9.f5iuJUQiEN-axWPtu-_7VxJO1N61Cq5zwsaDVa5DJ9w",
  },
};
