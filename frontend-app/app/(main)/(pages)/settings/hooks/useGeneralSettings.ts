import { useMe } from '../../../../hooks/auth/useMe';

export function useGeneralSettings() {
  const { data: userData } = useMe();
  const userName = userData?.name.split(' ')[0] || ''; // Obtener el nombre
  const userSurname = userData?.name.split(' ').slice(1).join(' ') || ''; //
  return { userData, userName, userSurname };
}
