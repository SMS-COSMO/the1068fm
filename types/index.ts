import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~~/server/trpc/routers';

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;

export type TPermission =
  'login' | // login to home page
  'admin' | // visit the admin page
  'review' | // review songs
  'arrange' | // arrange songs
  'time' | // set opening time
  'blockWords' | // manage block words
  'manageUser'; // manage users (listing, banning, ...)

export type TSongState = 'pending' | 'approved' | 'rejected' | 'used' | 'dropped';

// Seiue
export interface TCredentials { schoolId: string; password: string };
export interface TDirectCredentials { accessToken: string; activeReflectionId: number }
export interface TSeiueAuthResponse {
  token_type: 'bearer';
  expires_in: number;
  access_token: string;
  active_reflection_id: number;
};

// https://open.seiue.com/docs/api-users.html
export interface TSeiueUser {
  id?: number; // seiue internal id
  name: string; // name
  usin?: string; // school id
  pinyin: string;
  role: 'teacher' | 'guardian' | 'staff' | 'student' | 'shadow';
  phone?: string;
  status?: 'normal' | 'archived';
  gender?: 'm' | 'f';
}

export interface TSeiueSemester {
  id: number;
  name: string;
  is_current: boolean;
}

export type TSeiueSemesterList = TSeiueSemester[];

export interface TSeiueClass {
  id: number;
  name: string;
  extra_fields: {
    subject_name: string;
  };
}

export type TSeiueClassList = TSeiueClass[];

export interface TSeiueClassMember {
  reflection: {
    id: number;
    admin_classes: string[];
    usin: string;
    name: string;
    grade: {
      id: number;
      name: string;
    };
    graduates_in: {
      id: number;
      name: string;
    };
  };
}

export type TSeiueClassMemberList = TSeiueClassMember[];

export interface TSeiueGeneratedPhoneCode {
  ok: boolean;
  reminder_id: string;
};
