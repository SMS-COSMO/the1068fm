import type { TPermission } from '~~/types';

export const permissionNames: ({ value: TPermission; label: string; icon: string })[] = [
  { value: 'login', label: '登录', icon: 'lucide:log-in' },
  { value: 'admin', label: '管理', icon: 'lucide:settings-2' },
  { value: 'arrange', label: '排歌', icon: 'lucide:arrow-down-wide-narrow' },
  { value: 'manageUser', label: '管理用户', icon: 'lucide:user-cog' },
  { value: 'review', label: '审核歌曲', icon: 'lucide:music-4' },
];

export const breadCrumb: Record<string, string> = {
  admin: '管理',
  user: '用户管理',
  review: '歌曲审核',
  arrange: '排歌',
};
