import {type QodanaOrganization, type QodanaTeam} from '../types';

export const mockOrganization: QodanaOrganization = {
  name: 'JetBrains',
  visibility: 'private',
  teamCount: 202,
  memberCount: 815,
};

export const mockTeams: QodanaTeam[] = [
  {id: '1', name: 'Ines', projectCount: 1, memberCount: 1},
  {id: '2', name: 'Qodana Poly', projectCount: 1, memberCount: 1},
  {id: '3', name: 'kotlinx-rpc', projectCount: 1, memberCount: 1},
  {id: '4', name: 'Qodana Cloud', projectCount: 1, memberCount: 1},
  {id: '5', name: 'Qodana CLI', projectCount: 1, memberCount: 1},
  {id: '6', name: 'Qodana for PHP', projectCount: 1, memberCount: 1},
  {id: '7', name: 'Qodana for JVM', projectCount: 1, memberCount: 1},
  {id: '8', name: 'Qodana for JS', projectCount: 1, memberCount: 1},
  {id: '9', name: 'Qodana for .NET', projectCount: 1, memberCount: 1},
  {id: '10', name: 'Qodana for Python', projectCount: 1, memberCount: 1},
  {id: '11', name: 'Qodana for Go', projectCount: 1, memberCount: 1},
  {id: '12', name: 'Qodana for Ruby', projectCount: 1, memberCount: 1},
];
