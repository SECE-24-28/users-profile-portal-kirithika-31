import gql from "graphql-tag";

export const typeDefs = gql`
  type Student {
    id: Int!
    name: String!
    email: String!
    department: String!
    year: Int!
    image: String
  }

  type Auth {
    token: String!
  }

  type Query {
    students: [Student!]!
    student(id: Int!): Student
  }

  type Mutation {
    signup(
      email: String!
      password: String!
    ): Auth!

    login(
      email: String!
      password: String!
    ): Auth!

addStudent(
  name: String!
  email: String!
  password: String!
  department: String!
  year: Int!
  image: String
): Student!

    updateStudent(
      id: Int!
      name: String
      department: String
      year: Int
      image: String
    ): Student!

    deleteStudent(id: Int!): String!
  }
`;