/**
 * Utilidades para formatação e manipulação de datas
 */

/**
 * Formata uma data no formato brasileiro (DD/MM/AAAA)
 * @param dateString - String de data no formato ISO (ex: "2025-09-01T21:11:03.587Z")
 * @returns Data formatada em português brasileiro ou "Data inválida" se a data for inválida
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'Data não informada';
  }

  try {
    // Tenta criar uma data a partir da string
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      console.warn('Data inválida recebida:', dateString);
      return 'Data inválida';
    }

    // Formata a data no padrão brasileiro
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', dateString, error);
    return 'Data inválida';
  }
};

/**
 * Formata uma data com hora no formato brasileiro
 * @param dateString - String de data no formato ISO
 * @returns Data e hora formatadas em português brasileiro
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'Data não informada';
  }

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Data inválida recebida:', dateString);
      return 'Data inválida';
    }

    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', dateString, error);
    return 'Data inválida';
  }
};

/**
 * Verifica se uma data é válida
 * @param dateString - String de data para validar
 * @returns true se a data for válida, false caso contrário
 */
export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

/**
 * Converte uma string de data para objeto Date
 * @param dateString - String de data no formato ISO
 * @returns Objeto Date ou null se a data for inválida
 */
export const parseDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};
