export const userCreate = {
  success: true,
  data: {
    id: 18,
    email: 'yasoddsdh@yash.com',
    name: 'yash',
    password: '$2b$12$iCsMSjt27EKnQlFoDVunXe5BN',
  },
};

export const userCreateError = {
  success: false,
  message: 'User creation failed',
};

export const userList = {
  statusCode: 200,
  succuss: true,
  data: [
    {
      id: 25,
      name: 'yash',
      email: 'yadsdss@yash.com',
      password: '$2b$12$FQ9GU4y2HTJ/TU8hmJ3Kb.ebRbYazJH67FrfDYwbbKpqn2V8Ye2EC',
    },
    {
      id: 24,
      name: 'yash',
      email: 'yash@yash.com',
      password: '$2b$12$iCsMSjt27EKnQlFoDVunXe5BNs9cSKfv9cEfdj6tkiMGIQbrbEx/q',
    },
  ],
};
export const login = {
  statusCode: 200,
  succuss: true,
  data: {
    id: 24,
    name: 'yash',
    email: 'yash@yash.com',
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsImlhdCI6MTY2ODIyNTY2NiwiZXhwIjoxNjY5MDg5NjY2fQ.0NzAYtwxIw75rbqGxdL1R1pq9OwxapRMGPn3wR8JP7c',
  },
};
