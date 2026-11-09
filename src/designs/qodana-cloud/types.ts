export interface QodanaTeam {
  id: string;
  name: string;
  projectCount: number;
  memberCount: number;
}

export interface QodanaOrganization {
  name: string;
  visibility: 'private' | 'public';
  teamCount: number;
  memberCount: number;
}
