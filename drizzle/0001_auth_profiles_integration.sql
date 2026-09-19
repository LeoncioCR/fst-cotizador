-- ============================================
-- FST COTIZADOR
-- Integración auth.users -> public.profiles
-- ============================================


-- 1. Relacionar profiles con Supabase Auth
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_id_auth_users_fk
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;


-- 2. Habilitar RLS
ALTER TABLE public.profiles
ENABLE ROW LEVEL SECURITY;


-- 3. Crear automáticamente profile
-- cuando Supabase Auth crea un usuario.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  INSERT INTO public.profiles (
    id,
    full_name,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,

    NULLIF(
      TRIM(
        COALESCE(
          NEW.raw_user_meta_data ->> 'full_name',
          ''
        )
      ),
      ''
    ),

    'active'::public.profile_status,

    COALESCE(NEW.created_at, NOW()),

    NOW()
  )

  ON CONFLICT (id)
  DO NOTHING;

  RETURN NEW;

END;
$$;


-- 4. Crear trigger

DROP TRIGGER IF EXISTS
on_auth_user_created_profile
ON auth.users;

CREATE TRIGGER on_auth_user_created_profile

AFTER INSERT
ON auth.users

FOR EACH ROW

EXECUTE PROCEDURE
public.handle_new_auth_user_profile();


-- 5. Sincronizar usuarios que ya existan
-- antes de instalar esta migración.

INSERT INTO public.profiles (
  id,
  full_name,
  status,
  created_at,
  updated_at
)

SELECT

  u.id,

  NULLIF(
    TRIM(
      COALESCE(
        u.raw_user_meta_data ->> 'full_name',
        ''
      )
    ),
    ''
  ),

  'active'::public.profile_status,

  COALESCE(
    u.created_at,
    NOW()
  ),

  NOW()

FROM auth.users u

ON CONFLICT (id)
DO NOTHING;