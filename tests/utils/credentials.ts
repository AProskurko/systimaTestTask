interface UserData{
  valid: boolean;
  testUser: string;
  password: string;
}

const userData: UserData[] = [
  {
    valid: true,
    testUser: "joachim+453459@systima.no",
    password: "123456789",
  },
  {
    valid: false,
    testUser: "invalid@test.user",
    password: "invalidPassword",
  },
];

export { userData }