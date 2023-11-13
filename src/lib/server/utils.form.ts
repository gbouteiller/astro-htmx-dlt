import {type typeToFlattenedError} from 'astro/zod';

// METHODS =================================================================================================================================
//export function useForm(id: string): UseForm<undefined>;
//export function useForm<V extends Dict>(id: string, initialValues: V): UseForm<V>;
export function useForm<D extends Dict | undefined>(id: string, initialData?: D): UseForm<D> {
  const form: Form<D> = {id, valid: !initialData, data: initialData, errors: ERRORS};

  const addErrors = (errors: typeToFlattenedError<D>, data = initialData) => {
    form.valid = false;
    form.errors = errors;
    if (data) form.data = data;
  };

  const addFormError = (error: string, data = initialData) => addErrors({formErrors: [error], fieldErrors: {}}, data);

  const addValues = (data: D) => {
    form.valid = true;
    form.data = data;
  };

  //return {form};
  return {addErrors, addFormError, addValues, form};
}

export async function getUnsafe<D extends Record<string, unknown>>(
  request: Request
): Promise<{success: true; data: D} | {success: false; error: string}> {
  try {
    const data = await request.formData();
    return {success: true as const, data: Object.fromEntries(data.entries()) as D};
  } catch (error) {
    console.error(error);
    return {success: false as const, error: 'Erreur de récupération des données.'};
  }
}

// CONSTS ==================================================================================================================================
export const ERRORS: typeToFlattenedError<unknown> = {fieldErrors: {}, formErrors: []};

// TYPES ===================================================================================================================================
export type Dict = Record<string, string>;

export type Form<D extends Dict | undefined = Dict> = {
  data: D;
  errors: typeToFlattenedError<D>;
  id: string;
  valid: boolean;
};

export type UseForm<D extends Dict | undefined = Dict> = {
  addErrors: (errors: typeToFlattenedError<D>, values?: D) => void;
  addFormError: (error: string, values?: D) => void;
  addValues: (values: D) => void;
  form: Form<D>;
};
