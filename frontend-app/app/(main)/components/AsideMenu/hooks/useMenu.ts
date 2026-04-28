import { redirect } from 'next/navigation';
import { useLogout } from '../../../../hooks/auth/useLogout';
import { useMe } from '../../../../hooks/auth/useMe';

export function useMenu() {
  const { mutateAsync } = useLogout();
  const { data } = useMe();
  const userName = data?.name?.split(' ')[0] || ''; // Obtener el nombre
  const userSurname = data?.name?.split(' ').slice(1).join(' ') || ''; // Obtener el apellido

  async function onClickLogout() {
    await mutateAsync();
    redirect('/login'); // Redirigir al login después de hacer logout
  }

  return {
    fullName: data?.name || '',
    userName,
    userSurname,
    role: data?.role || '',
    onClickLogout,
  };
}
