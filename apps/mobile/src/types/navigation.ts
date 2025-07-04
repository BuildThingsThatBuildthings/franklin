export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  Onboarding: undefined;
  OutcomeManagement: {
    roleId: string;
    roleName: string;
  };
  Milestones: {
    outcomeId: string;
    outcomeTitle: string;
    roleName: string;
  };
  MicroSteps: {
    milestoneId: string;
    milestoneTitle: string;
    outcomeTitle: string;
    roleName: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Roles: undefined;
  CheckIn: undefined;
  Progress: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}