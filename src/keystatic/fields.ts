import { fields } from '@keystatic/core';

/** Standard ordering field used by every sortable collection. */
export const orderField = (
  label = 'Kolejność',
  description = 'Im mniejsza liczba, tym wyżej pozycja na liście.'
) =>
  fields.integer({
    label,
    description,
    defaultValue: 0,
  });

/** Title field that also drives the file name (slug). */
export const slugTitle = (label: string, slugDescription?: string) =>
  fields.slug({
    name: { label, validation: { isRequired: true } },
    slug: {
      label: 'Identyfikator (slug)',
      description:
        slugDescription ??
        'Identyfikator jest używany w adresach i powiązaniach. Zmieniaj go ostrożnie.',
      validation: {
        pattern: {
          regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          message: 'Używaj małych liter, cyfr i myślników.',
        },
      },
    },
  });

export const eyebrowField = (defaultValue: string) =>
  fields.text({
    label: 'Nadtytuł',
    defaultValue,
  });

export const headingField = (defaultValue: string, label = 'Nagłówek') =>
  fields.text({
    label,
    defaultValue,
  });

export const authorField = (defaultValue: string, description: string) =>
  fields.text({
    label: 'Autor',
    description,
    defaultValue,
  });
