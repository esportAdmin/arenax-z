--
-- PostgreSQL database dump
--

\restrict vgMoufxLtzhAm0rSMt5Ms3MUb7uPLvb6Y3WhN8aPZcfp6OuOnqArS9XL0zAModk

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: pg_cron; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION pg_cron; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL';


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA public;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: app_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


ALTER TYPE public.app_role OWNER TO postgres;

--
-- Name: arena_source; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.arena_source AS ENUM (
    'purchase',
    'contest_refill',
    'refund',
    'prize',
    'manual',
    'prediction_win',
    'prediction_loss',
    'staking_reward',
    'season_reward'
);


ALTER TYPE public.arena_source OWNER TO postgres;

--
-- Name: badge_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.badge_category AS ENUM (
    'prediction',
    'streak',
    'engagement',
    'achievement',
    'special'
);


ALTER TYPE public.badge_category OWNER TO postgres;

--
-- Name: badge_rarity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.badge_rarity AS ENUM (
    'common',
    'rare',
    'epic',
    'legendary'
);


ALTER TYPE public.badge_rarity OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: accept_alliance_invite(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.accept_alliance_invite(p_invite_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_alliance_id uuid;
  v_club_id uuid;
begin
  select alliance_id, club_id
  into v_alliance_id, v_club_id
  from public.alliance_invites
  where id = p_invite_id
    and status = 'pending';

  if v_alliance_id is null then
    raise exception 'Invite not found or already processed';
  end if;

  if exists (
    select 1
    from public.alliance_members
    where club_id = v_club_id
  ) then
    raise exception 'Club already belongs to an alliance';
  end if;

  insert into public.alliance_members (
    alliance_id,
    club_id,
    role
  )
  values (
    v_alliance_id,
    v_club_id,
    'member'
  );

  update public.alliance_invites
  set
    status = 'accepted',
    responded_at = now()
  where id = p_invite_id;

  return v_alliance_id;
end;
$$;


ALTER FUNCTION public.accept_alliance_invite(p_invite_id uuid) OWNER TO postgres;

--
-- Name: add_arena_balance(integer, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Récupérer l'ID utilisateur authentifié
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Validation du montant
  IF p_amount <= 0 OR p_amount > 10000 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid amount (must be 1-10000)'
    );
  END IF;

  -- Validation du type de transaction
  IF p_transaction_type NOT IN (
    'earn_prediction', 'earn_streak', 'earn_challenge', 
    'refund', 'admin_adjustment'
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid transaction type for adding balance'
    );
  END IF;

  -- Récupérer le solde actuel (avec verrou pour éviter race conditions)
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE; -- CRITIQUE : Verrou pessimiste

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile not found'
    );
  END IF;

  -- Calculer nouveau solde
  v_new_balance := v_current_balance + p_amount;

  -- Mettre à jour le profil
  UPDATE profiles
  SET 
    arena_balance = v_new_balance,
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Créer l'entrée d'audit
  INSERT INTO arena_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    reference_id,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    v_user_id,
    p_transaction_type,
    p_amount,
    v_current_balance,
    v_new_balance,
    p_reference_id,
    p_metadata,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  )
  RETURNING id INTO v_transaction_id;

  -- Retourner le succès
  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'transaction_id', v_transaction_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;


ALTER FUNCTION public.add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) OWNER TO postgres;

--
-- Name: add_arena_secure(bigint, public.arena_source, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text DEFAULT NULL::text, p_reference_id text DEFAULT NULL::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance BIGINT;
  v_new_balance BIGINT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Validation
  IF p_amount <= 0 OR p_amount > 10000 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid amount (1-10000)');
  END IF;

  -- Récupérer balance avec verrou
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  v_new_balance := v_current_balance + p_amount;

  -- Mettre à jour
  UPDATE profiles
  SET arena_balance = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Logger dans ledger
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, p_amount, p_source, p_description, p_reference_id);

  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'amount_added', p_amount
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) OWNER TO postgres;

--
-- Name: FUNCTION add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) IS 'Ajouter de l''ARENA de manière sécurisée avec logging';


--
-- Name: add_club_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_club_xp(p_user_id uuid, p_xp integer) RETURNS void
    LANGUAGE plpgsql
    AS $$

declare
v_club uuid;

begin

select club_id
into v_club
from club_members
where user_id = p_user_id
limit 1;

if v_club is null then
return;
end if;

update clubs
set total_xp = total_xp + p_xp
where id = v_club;

update club_members
set xp_contributed = xp_contributed + p_xp
where user_id = p_user_id;

update club_wars
set challenger_xp = challenger_xp + p_xp
where challenger_id = v_club
and status = 'active';

update club_wars
set defender_xp = defender_xp + p_xp
where defender_id = v_club
and status = 'active';

end;

$$;


ALTER FUNCTION public.add_club_xp(p_user_id uuid, p_xp integer) OWNER TO postgres;

--
-- Name: add_war_contribution(uuid, uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  user_role text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if auth.uid() <> p_user then
    raise exception 'User spoofing detected';
  end if;

  if p_xp <= 0 or p_xp > 100 then
    raise exception 'Invalid XP amount';
  end if;

  if exists (
    select 1
    from war_contributions
    where user_id = p_user
      and created_at > now() - interval '2 seconds'
  ) then
    raise exception 'Rate limit exceeded';
  end if;

  select role
    into user_role
  from club_members
  where club_id = p_club
    and user_id = p_user
  limit 1;

  if user_role is null then
    raise exception 'User is not a member of this club';
  end if;

  perform 1
  from club_wars
  where id = p_war
    and status = 'active'
  for update;

  if not exists (
    select 1
    from club_wars
    where id = p_war
      and status = 'active'
  ) then
    raise exception 'War not active';
  end if;

  if not exists (
    select 1
    from club_wars
    where id = p_war
      and (challenger_id = p_club or defender_id = p_club)
  ) then
    raise exception 'Club not involved in this war';
  end if;

  insert into war_contributions (
    war_id,
    user_id,
    club_id,
    xp,
    created_at
  )
  values (
    p_war,
    p_user,
    p_club,
    p_xp,
    now()
  );
end;
$$;


ALTER FUNCTION public.add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer) OWNER TO postgres;

--
-- Name: add_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_xp(p_user_id uuid, p_amount integer) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_active_season uuid;
  v_multiplier numeric := 1;
  v_bonus_amount integer;
  v_season_xp integer;
  v_new_tier text;
  v_club_id uuid;
begin

  -- VALIDATION
  if p_amount is null or p_amount <= 0 then
    return json_build_object(
      'success', false,
      'error', 'Invalid XP amount'
    );
  end if;

  -- SUBSCRIPTION MULTIPLIER
  select 
    case 
      when stripe_price_id ilike '%elite%' then 1.5
      when stripe_price_id ilike '%pro%' then 1.2
      else 1
    end
  into v_multiplier
  from subscriptions
  where user_id = p_user_id
    and status = 'active'
  limit 1;

  if v_multiplier is null then
    v_multiplier := 1;
  end if;

  v_bonus_amount := floor(p_amount * v_multiplier);

  -- ACTIVE SEASON
  select id into v_active_season
  from seasons
  where is_active = true
  limit 1;

  if v_active_season is null then
    return json_build_object(
      'success', false,
      'error', 'No active season'
    );
  end if;

  -- SEASON XP
  insert into season_xp (
    season_id,
    user_id,
    xp,
    level,
    created_at,
    updated_at
  )
  values (
    v_active_season,
    p_user_id,
    v_bonus_amount,
    1,
    now(),
    now()
  )
  on conflict (season_id, user_id)
  do update set
    xp = season_xp.xp + v_bonus_amount,
    level = floor((season_xp.xp + v_bonus_amount) / 500) + 1,
    updated_at = now()
  returning xp into v_season_xp;

  -- TIER CALCULATION
  if v_season_xp >= 10000 then
    v_new_tier := 'challenger';
  elsif v_season_xp >= 6000 then
    v_new_tier := 'diamond';
  elsif v_season_xp >= 3000 then
    v_new_tier := 'platinum';
  elsif v_season_xp >= 1500 then
    v_new_tier := 'gold';
  elsif v_season_xp >= 500 then
    v_new_tier := 'silver';
  else
    v_new_tier := 'bronze';
  end if;

  perform public.check_and_reward_tier_upgrade(
    p_user_id,
    v_active_season,
    v_new_tier
  );

  -- CLUB WAR XP
  select club_id
  into v_club_id
  from club_members
  where user_id = p_user_id
  limit 1;

  if v_club_id is not null then
    perform public.increment_club_war_xp(v_club_id, v_bonus_amount);
  end if;

  return json_build_object(
    'success', true,
    'xp_added', v_bonus_amount,
    'multiplier', v_multiplier,
    'season_tier', v_new_tier
  );

end;
$$;


ALTER FUNCTION public.add_xp(p_user_id uuid, p_amount integer) OWNER TO postgres;

--
-- Name: apply_bonus(integer, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_bonus(base_xp integer, territory_id uuid) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  v_bonus int := 0;
begin
  select count(*) into v_bonus
  from territory_adjacency ta
  join club_territories t
    on t.id = ta.adjacent_territory_id
  where ta.territory_id = territory_id;

  return (base_xp * (1 + v_bonus * 0.1))::int;
end;
$$;


ALTER FUNCTION public.apply_bonus(base_xp integer, territory_id uuid) OWNER TO postgres;

--
-- Name: apply_boss_damage(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_boss_damage(p_club_id uuid, p_damage integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_boss record;
begin

  select *
  into v_boss
  from world_boss
  where status = 'active'
  limit 1;

  if not found then
    return;
  end if;

  update world_boss
  set current_hp = greatest(0, current_hp - p_damage)
  where id = v_boss.id;

  insert into boss_damage (boss_id, club_id, damage)
  values (v_boss.id, p_club_id, p_damage);

end;
$$;


ALTER FUNCTION public.apply_boss_damage(p_club_id uuid, p_damage integer) OWNER TO postgres;

--
-- Name: apply_club_promotions(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_club_promotions(p_season_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_tier text;
  v_total integer;
  v_promote_count integer;
  v_relegate_count integer;
begin

  for v_tier in
    select distinct tier
    from club_season_stats
    where season_id = p_season_id
  loop

    select count(*) into v_total
    from club_season_stats
    where season_id = p_season_id
    and tier = v_tier;

    v_promote_count := ceil(v_total * 0.2);
    v_relegate_count := ceil(v_total * 0.2);

    -- Promotion
    update club_season_stats
    set tier = case
      when tier = 'bronze' then 'silver'
      when tier = 'silver' then 'gold'
      when tier = 'gold' then 'platinum'
      when tier = 'platinum' then 'diamond'
      when tier = 'diamond' then 'challenger'
      else tier
    end
    where id in (
      select id
      from club_season_stats
      where season_id = p_season_id
      and tier = v_tier
      order by season_score desc
      limit v_promote_count
    );

    -- Relegation
    update club_season_stats
    set tier = case
      when tier = 'challenger' then 'diamond'
      when tier = 'diamond' then 'platinum'
      when tier = 'platinum' then 'gold'
      when tier = 'gold' then 'silver'
      when tier = 'silver' then 'bronze'
      else tier
    end
    where id in (
      select id
      from club_season_stats
      where season_id = p_season_id
      and tier = v_tier
      order by season_score asc
      limit v_relegate_count
    );

  end loop;

end;
$$;


ALTER FUNCTION public.apply_club_promotions(p_season_id uuid) OWNER TO postgres;

--
-- Name: apply_club_upkeep(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_club_upkeep() RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  r record;
begin
  for r in
    select
      c.id,
      coalesce(sum(t.upkeep_cost), 0) as upkeep
    from clubs c
    left join club_territories t
      on t.controlling_club_id = c.id
    group by c.id
  loop
    update clubs
    set gold = gold - r.upkeep
    where id = r.id;

    -- 🔥 penalty
    if (select gold from clubs where id = r.id) < 0 then
      update clubs
      set energy = energy - 10
      where id = r.id;
    end if;
  end loop;
end;
$$;


ALTER FUNCTION public.apply_club_upkeep() OWNER TO postgres;

--
-- Name: apply_club_xp_from_prediction(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_club_xp_from_prediction() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  v_club_id uuid;
begin

  -- récupérer le club du joueur
  select club_id
  into v_club_id
  from club_members
  where user_id = new.user_id
  limit 1;

  -- si pas de club → stop
  if v_club_id is null then
    return new;
  end if;

  -- ajouter xp au club
  update clubs
  set total_xp = total_xp + 10
  where id = v_club_id;

  -- ajouter xp contribution membre
  update club_members
  set xp_contributed = xp_contributed + 10
  where user_id = new.user_id
  and club_id = v_club_id;

  -- ajouter xp dans la war active
  update club_wars
  set
    challenger_xp = challenger_xp + 10
  where status = 'active'
  and challenger_id = v_club_id;

  update club_wars
  set
    defender_xp = defender_xp + 10
  where status = 'active'
  and defender_id = v_club_id;

  return new;

end;
$$;


ALTER FUNCTION public.apply_club_xp_from_prediction() OWNER TO postgres;

--
-- Name: apply_influence_capture_tick(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_influence_capture_tick() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  r record;
  v_count integer := 0;
  v_new_progress integer;
  v_capture_owner uuid;
begin
  for r in
    select
      tim.territory_id,
      tim.club_id,
      tim.influence_score,
      ct.capture_progress,
      ct.controlling_club_id
    from public.territory_influence_map tim
    join public.club_territories ct
      on ct.id = tim.territory_id
  loop
    if r.influence_score > 0 then
      v_new_progress := least(100, coalesce(r.capture_progress, 0) + (r.influence_score * 3));

      update public.club_territories
      set
        capture_progress = v_new_progress,
        updated_at = now()
      where id = r.territory_id;

      if v_new_progress >= 100 then
        if r.club_id is not null and r.controlling_club_id is distinct from r.club_id then
          update public.club_territories
          set
            controlling_club_id = r.club_id,
            capture_progress = 0,
            updated_at = now()
          where id = r.territory_id;
        else
          update public.club_territories
          set
            capture_progress = 0,
            updated_at = now()
          where id = r.territory_id;
        end if;
      end if;

      v_count := v_count + 1;
    elsif r.influence_score < 0 then
      v_new_progress := greatest(0, coalesce(r.capture_progress, 0) + r.influence_score);

      update public.club_territories
      set
        capture_progress = v_new_progress,
        updated_at = now()
      where id = r.territory_id;

      v_count := v_count + 1;
    end if;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.apply_influence_capture_tick() OWNER TO postgres;

--
-- Name: apply_ranked_result(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_season_id uuid;
  v_match_id uuid;
begin
  select id
  into v_season_id
  from public.seasons
  where is_active = true
  limit 1;

  insert into public.ranked_matches (
    season_id,
    club_a_id,
    club_b_id,
    winner_club_id,
    loser_club_id,
    elo_delta,
    status
  )
  values (
    v_season_id,
    p_winner_club_id,
    p_loser_club_id,
    p_winner_club_id,
    p_loser_club_id,
    25,
    'finished'
  )
  returning id into v_match_id;

  update public.club_season_stats
  set
    elo_rating = coalesce(elo_rating, 1000) + 25,
    war_wins = coalesce(war_wins, 0) + 1
  where club_id = p_winner_club_id
    and season_id = v_season_id;

  update public.club_season_stats
  set
    elo_rating = greatest(800, coalesce(elo_rating, 1000) - 25),
    war_losses = coalesce(war_losses, 0) + 1
  where club_id = p_loser_club_id
    and season_id = v_season_id;

  return v_match_id;
end;
$$;


ALTER FUNCTION public.apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid) OWNER TO postgres;

--
-- Name: apply_unit_war_support(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_unit_war_support() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  r_war record;
  v_attack_bonus integer := 0;
  v_defense_bonus integer := 0;
  v_count integer := 0;
begin
  for r_war in
    select id, challenger_id, defender_id, territory_id
    from public.club_wars
    where status = 'active'
  loop
    select coalesce(sum(power), 0)::integer
    into v_attack_bonus
    from public.club_units
    where club_id = r_war.challenger_id
      and territory_id = r_war.territory_id
      and status = 'idle';

    select coalesce(sum(power), 0)::integer
    into v_defense_bonus
    from public.club_units
    where club_id = r_war.defender_id
      and territory_id = r_war.territory_id
      and status = 'idle';

    if v_attack_bonus > 0 then
      insert into public.war_contributions (
        war_id,
        user_id,
        club_id,
        xp,
        created_at
      )
      values (
        r_war.id,
        null,
        r_war.challenger_id,
        least(50, v_attack_bonus),
        now()
      );
    end if;

    if v_defense_bonus > 0 then
      insert into public.war_contributions (
        war_id,
        user_id,
        club_id,
        xp,
        created_at
      )
      values (
        r_war.id,
        null,
        r_war.defender_id,
        least(50, v_defense_bonus),
        now()
      );
    end if;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.apply_unit_war_support() OWNER TO postgres;

--
-- Name: apply_war_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.apply_war_xp(p_club_id uuid, p_xp integer) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_war record;
  v_attack integer;
begin

  select *
  into v_war
  from club_wars
  where status = 'active'
  and (
    challenger_id = p_club_id
    or defender_id = p_club_id
  )
  limit 1;

  if not found then
    return;
  end if;

  v_attack := floor(p_xp * 0.2);

  if v_war.challenger_id = p_club_id then

    update club_wars
    set challenger_xp = challenger_xp + p_xp,
        defender_xp = greatest(0, defender_xp - v_attack)
    where id = v_war.id;

  else

    update club_wars
    set defender_xp = defender_xp + p_xp,
        challenger_xp = greatest(0, challenger_xp - v_attack)
    where id = v_war.id;

  end if;

end;
$$;


ALTER FUNCTION public.apply_war_xp(p_club_id uuid, p_xp integer) OWNER TO postgres;

--
-- Name: approve_join_request(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.approve_join_request(p_request_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_request record;
begin
  -- Get request
  select *
  into v_request
  from club_join_requests
  where id = p_request_id
  and status = 'pending';

  if not found then
    return json_build_object(
      'success', false,
      'error', 'Request not found or already processed'
    );
  end if;

  -- Add membership
  insert into club_members (
    club_id,
    user_id,
    role,
    xp_contributed
  )
  values (
    v_request.club_id,
    v_request.user_id,
    'member',
    0
  );

  -- Update request status
  update club_join_requests
  set status = 'approved'
  where id = p_request_id;

  -- 🔥 Activity log
  insert into club_activities (
    club_id,
    user_id,
    activity_type,
    title,
    description,
    xp_amount
  )
  values (
    v_request.club_id,
    v_request.user_id,
    'member_joined',
    'Nouveau membre',
    'Un joueur a rejoint le club',
    0
  );

  return json_build_object('success', true);

exception when others then
  return json_build_object(
    'success', false,
    'error', SQLERRM
  );
end;
$$;


ALTER FUNCTION public.approve_join_request(p_request_id uuid) OWNER TO postgres;

--
-- Name: auth_role_test(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auth_role_test() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select current_role;
$$;


ALTER FUNCTION public.auth_role_test() OWNER TO postgres;

--
-- Name: auto_matchmake_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_matchmake_wars() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_season_id uuid;
  v_created_count integer := 0;
  r_challenger record;
  r_defender record;
  r_territory record;
begin
  select id
  into v_season_id
  from public.seasons
  where is_active = true
  limit 1;

  if v_season_id is null then
    raise exception 'No active season';
  end if;

  for r_challenger in
    select c.id
    from public.clubs c
    where not exists (
      select 1
      from public.club_wars w
      where w.status = 'active'
        and (w.challenger_id = c.id or w.defender_id = c.id)
    )
    order by c.created_at nulls last, c.id
  loop
    select c.id
    into r_defender
    from public.clubs c
    where c.id <> r_challenger.id
      and not exists (
        select 1
        from public.club_wars w
        where w.status = 'active'
          and (w.challenger_id = c.id or w.defender_id = c.id)
      )
      and public.can_attack(r_challenger.id, c.id) = true
    order by c.created_at nulls last, c.id
    limit 1;

    if r_defender.id is null then
      continue;
    end if;

    select t.id
    into r_territory
    from public.club_territories t
    where not exists (
      select 1
      from public.club_wars w
      where w.status = 'active'
        and w.territory_id = t.id
    )
    order by t.strategic_value desc nulls last, t.created_at nulls last, t.id
    limit 1;

    if r_territory.id is null then
      continue;
    end if;

    insert into public.club_wars (
      challenger_id,
      defender_id,
      territory_id,
      season_id,
      status,
      challenger_xp,
      defender_xp,
      challenger_predictions,
      defender_predictions,
      challenger_wins,
      defender_wins,
      xp_reward,
      created_at,
      updated_at
    )
    values (
      r_challenger.id,
      r_defender.id,
      r_territory.id,
      v_season_id,
      'active',
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      now(),
      now()
    );

    v_created_count := v_created_count + 1;
  end loop;

  return v_created_count;
end;
$$;


ALTER FUNCTION public.auto_matchmake_wars() OWNER TO postgres;

--
-- Name: auto_matchmaking(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_matchmaking() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_territory record;
  v_attacker uuid;
  v_defender uuid;
begin
  for v_territory in
    select id, controlling_club_id
    from public.club_territories
  loop
    -- pick random attacker (different club)
    select id into v_attacker
    from public.clubs
    where id != v_territory.controlling_club_id
    order by random()
    limit 1;

    v_defender := v_territory.controlling_club_id;

    -- skip if invalid
    if v_attacker is null or v_defender is null then
      continue;
    end if;

    -- skip if alliance (rule added later)
    if exists (
      select 1
      from alliance_members am1
      join alliance_members am2
        on am1.alliance_id = am2.alliance_id
      where am1.club_id = v_attacker
        and am2.club_id = v_defender
    ) then
      continue;
    end if;

    -- create war
    insert into public.club_wars (
      territory_id,
      attacker_club_id,
      defender_club_id,
      status,
      created_at
    )
    values (
      v_territory.id,
      v_attacker,
      v_defender,
      'active',
      now()
    );
  end loop;
end;
$$;


ALTER FUNCTION public.auto_matchmaking() OWNER TO postgres;

--
-- Name: award_prediction_xp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.award_prediction_xp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin

  update predictions
  set is_correct = true
  where match_id = NEW.id
  and predicted_winner = NEW.winner;

  insert into season_xp (user_id, season_id, xp)
  select user_id, NEW.season_id, 25
  from predictions
  where match_id = NEW.id
  and predicted_winner = NEW.winner;

  return NEW;

end;
$$;


ALTER FUNCTION public.award_prediction_xp() OWNER TO postgres;

--
-- Name: can_attack(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_attack(p_attacker_club_id uuid, p_defender_club_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  if exists (
    select 1
    from public.alliance_members am1
    join public.alliance_members am2
      on am1.alliance_id = am2.alliance_id
    where am1.club_id = p_attacker_club_id
      and am2.club_id = p_defender_club_id
  ) then
    return false;
  end if;

  return true;
end;
$$;


ALTER FUNCTION public.can_attack(p_attacker_club_id uuid, p_defender_club_id uuid) OWNER TO postgres;

--
-- Name: can_invade_territory(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_invade_territory(p_club_id uuid, p_target_territory uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
declare
  v_count int;
begin

select count(*)
into v_count
from territory_connections tc
join club_territories my
  on my.id = tc.territory_a or my.id = tc.territory_b
where my.controlling_club_id = p_club_id
and (
  tc.territory_a = p_target_territory
  or tc.territory_b = p_target_territory
);

return v_count > 0;
end;
$$;


ALTER FUNCTION public.can_invade_territory(p_club_id uuid, p_target_territory uuid) OWNER TO postgres;

--
-- Name: capture_territory(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.capture_territory(p_club_id uuid, p_territory_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
begin
  update club_territories
  set controlling_club_id = p_club_id,
      updated_at = now()
  where id = p_territory_id;

  return json_build_object(
    'success', true,
    'territory_id', p_territory_id,
    'club_id', p_club_id
  );
end;
$$;


ALTER FUNCTION public.capture_territory(p_club_id uuid, p_territory_id uuid) OWNER TO postgres;

--
-- Name: check_and_resolve_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_and_resolve_war(p_war_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_total_xp integer := 0;
  v_created_at timestamptz;
  v_status text;
begin
  select
    coalesce(sum(xp), 0)::integer
  into v_total_xp
  from public.war_contributions
  where war_id = p_war_id;

  select
    created_at,
    status
  into
    v_created_at,
    v_status
  from public.club_wars
  where id = p_war_id
  limit 1;

  if v_status is distinct from 'active' then
    return;
  end if;

  if v_total_xp >= 500
     or v_created_at <= now() - interval '30 minutes'
  then
    perform public.resolve_war_capture(p_war_id);
  end if;
end;
$$;


ALTER FUNCTION public.check_and_resolve_war(p_war_id uuid) OWNER TO postgres;

--
-- Name: check_and_reward_tier_upgrade(uuid, uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_old_tier text;
begin

  -- Récupérer le tier actuel pour cette saison
  select tier
  into v_old_tier
  from user_season_tiers
  where user_id = p_user_id
    and season_id = p_season_id;

  -- Si aucun tier encore → initialisation
  if v_old_tier is null then
    insert into user_season_tiers (
      user_id,
      season_id,
      tier,
      updated_at
    )
    values (
      p_user_id,
      p_season_id,
      p_new_tier,
      now()
    );
    return;
  end if;

  -- Si aucun changement → stop
  if v_old_tier = p_new_tier then
    return;
  end if;

  -- Mise à jour tier
  update user_season_tiers
  set tier = p_new_tier,
      updated_at = now()
  where user_id = p_user_id
    and season_id = p_season_id;

  -- Création notification
  insert into user_notifications (
    user_id,
    type,
    title,
    message,
    payload
  )
  values (
    p_user_id,
    'tier_promotion',
    'Promotion de division !',
    'Vous avez atteint la division ' || upper(p_new_tier),
    jsonb_build_object(
      'old_tier', v_old_tier,
      'new_tier', p_new_tier
    )
  );

end;
$$;


ALTER FUNCTION public.check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text) OWNER TO postgres;

--
-- Name: check_auto_battle(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_auto_battle() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  enemy_count int;
begin
  select count(*) into enemy_count
  from club_units
  where territory_id = new.territory_id
    and club_id <> new.club_id;

  if enemy_count > 0 then
    perform public.resolve_unit_encounters();
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.check_auto_battle() OWNER TO postgres;

--
-- Name: check_rate_limit(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_rate_limit(p_action_type text, p_max_per_hour integer) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_count INTEGER;
BEGIN
  v_user_id := auth.uid();
  
  -- Compter les actions dans la dernière heure
  SELECT COUNT(*) INTO v_count
  FROM rate_limits
  WHERE 
    user_id = v_user_id 
    AND action_type = p_action_type
    AND window_start > NOW() - INTERVAL '1 hour';

  IF v_count >= p_max_per_hour THEN
    RETURN false; -- Rate limit dépassé
  END IF;

  -- Insérer l'action
  INSERT INTO rate_limits (user_id, action_type)
  VALUES (v_user_id, p_action_type);

  RETURN true;
END;
$$;


ALTER FUNCTION public.check_rate_limit(p_action_type text, p_max_per_hour integer) OWNER TO postgres;

--
-- Name: check_war_completion(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_war_completion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
  total int;
begin
  select coalesce(sum(xp),0)
  into total
  from war_contributions
  where war_id = new.war_id;

  if total >= 500 then
    perform resolve_war(new.war_id);
  end if;

  return new;
end;
$$;


ALTER FUNCTION public.check_war_completion() OWNER TO postgres;

--
-- Name: claim_club_challenge_reward(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_xp_reward int;
begin
  select t.xp_reward
  into v_xp_reward
  from club_challenges c
  join club_challenge_templates t on c.template_id = t.id
  where c.id = p_challenge_id
  and c.status = 'completed'
  and c.rewards_claimed = false;

  if v_xp_reward is null then
    return json_build_object('success', false, 'error', 'Not eligible');
  end if;

  update club_challenges
  set rewards_claimed = true
  where id = p_challenge_id;

  return json_build_object('success', true, 'xp_reward', v_xp_reward);
end;
$$;


ALTER FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid) OWNER TO postgres;

--
-- Name: claim_club_season_reward(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.claim_club_season_reward(p_ranking_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_rank integer;
  v_reward record;
begin
  select rank
  into v_rank
  from club_season_rankings
  where id = p_ranking_id
    and rewards_claimed = false;

  if v_rank is null then
    return json_build_object(
      'success', false,
      'error', 'Ranking not eligible'
    );
  end if;

  select *
  into v_reward
  from club_season_rewards
  where active = true
    and v_rank between rank_from and rank_to
  limit 1;

  update club_season_rankings
  set rewards_claimed = true,
      updated_at = now()
  where id = p_ranking_id;

  return json_build_object(
    'success', true,
    'rank', v_rank,
    'xp_bonus', coalesce(v_reward.xp_bonus, 0),
    'arena_points', coalesce(v_reward.arena_points, 0),
    'badge_name', v_reward.badge_name
  );
end;
$$;


ALTER FUNCTION public.claim_club_season_reward(p_ranking_id uuid) OWNER TO postgres;

--
-- Name: cleanup_rate_limits(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_rate_limits() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$;


ALTER FUNCTION public.cleanup_rate_limits() OWNER TO postgres;

--
-- Name: complete_daily_challenge_reward(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer DEFAULT 50) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance BIGINT;
  v_current_streak INTEGER;
  v_new_balance BIGINT;
  v_new_streak INTEGER;
BEGIN
  -- Récupérer l'ID utilisateur authentifié
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Récupérer le profil avec verrou (éviter race conditions)
  SELECT arena_balance, active_streak
  INTO v_current_balance, v_current_streak
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile not found'
    );
  END IF;

  -- Calculer les nouvelles valeurs
  v_new_balance := v_current_balance + p_xp_reward;
  v_new_streak := v_current_streak + 1;

  -- Mettre à jour le profil
  UPDATE profiles
  SET 
    arena_balance = v_new_balance,
    active_streak = v_new_streak,
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Enregistrer dans le ledger pour traçabilité
  INSERT INTO arena_ledger (user_id, amount, source, description)
  VALUES (
    v_user_id,
    p_xp_reward,
    'contest_refill',
    'Daily challenge completed'
  );

  -- Retourner le succès avec les nouvelles valeurs
  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'new_streak', v_new_streak
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;


ALTER FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer) OWNER TO postgres;

--
-- Name: FUNCTION complete_daily_challenge_reward(p_xp_reward integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer) IS 'Récompense sécurisée pour daily challenge avec mise à jour du streak';


--
-- Name: complete_ready_unit_movements(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.complete_ready_unit_movements() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  r_move record;
  v_count integer := 0;
begin
  for r_move in
    select *
    from public.unit_movements
    where status = 'moving'
      and arrival_at <= now()
  loop
    update public.club_units
    set
      territory_id = r_move.to_territory_id,
      status = 'idle',
      updated_at = now()
    where id = r_move.unit_id;

    update public.unit_movements
    set
      status = 'completed',
      completed_at = now()
    where id = r_move.id;

    update public.unit_orders
    set
      status = 'completed',
      completed_at = now()
    where unit_id = r_move.unit_id
      and target_territory_id = r_move.to_territory_id
      and status = 'started';

    perform public.start_war_from_unit_arrival(r_move.id);

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.complete_ready_unit_movements() OWNER TO postgres;

--
-- Name: create_alliance(text, text, uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_alliance_id uuid;
begin
  if exists (
    select 1
    from public.alliance_members
    where club_id = p_owner_club_id
  ) then
    raise exception 'Club already belongs to an alliance';
  end if;

  insert into public.alliances (
    name,
    description,
    owner_club_id,
    season_id
  )
  values (
    p_name,
    p_description,
    p_owner_club_id,
    p_season_id
  )
  returning id into v_alliance_id;

  insert into public.alliance_members (
    alliance_id,
    club_id,
    role
  )
  values (
    v_alliance_id,
    p_owner_club_id,
    'owner'
  );

  return v_alliance_id;
end;
$$;


ALTER FUNCTION public.create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid) OWNER TO postgres;

--
-- Name: create_auto_war(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_auto_war(p_club_id uuid, p_duration_hours integer DEFAULT 48) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_opponent uuid;
  v_war_id uuid;
begin
  -- 1) Trouver adversaire
  v_opponent := public.find_war_opponent(p_club_id);

  if v_opponent is null then
    return json_build_object(
      'success', false,
      'error', 'No suitable opponent found'
    );
  end if;

  -- 2) Double safety: aucun des deux clubs ne doit déjà être en war active
  if exists (
    select 1
    from club_wars w
    where w.status = 'active'
      and (w.challenger_id = p_club_id or w.defender_id = p_club_id)
  ) then
    return json_build_object(
      'success', false,
      'error', 'Your club is already in an active war'
    );
  end if;

  if exists (
    select 1
    from club_wars w
    where w.status = 'active'
      and (w.challenger_id = v_opponent or w.defender_id = v_opponent)
  ) then
    return json_build_object(
      'success', false,
      'error', 'Opponent is already in an active war'
    );
  end if;

  -- 3) Créer la war (start now)
  insert into club_wars (
    challenger_id,
    defender_id,
    status,
    start_date,
    end_date,
    challenger_xp,
    defender_xp,
    challenger_predictions,
    defender_predictions,
    challenger_wins,
    defender_wins,
    xp_reward,
    created_at,
    updated_at
  )
  values (
    p_club_id,
    v_opponent,
    'active',
    now(),
    now() + make_interval(hours => p_duration_hours),
    0,
    0,
    0,
    0,
    0,
    0,
    250,         -- reward par défaut (ajuste si tu veux)
    now(),
    now()
  )
  returning id into v_war_id;

  return json_build_object(
    'success', true,
    'war_id', v_war_id,
    'opponent_id', v_opponent
  );

exception
  when others then
    return json_build_object(
      'success', false,
      'error', sqlerrm
    );
end;
$$;


ALTER FUNCTION public.create_auto_war(p_club_id uuid, p_duration_hours integer) OWNER TO postgres;

--
-- Name: create_club_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_club_war(p_club_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  opponent uuid;
  war_id uuid;
begin

  -- vérifier si le club est déjà en war
  if exists (
    select 1 from club_wars
    where status = 'active'
    and (challenger_id = p_club_id or defender_id = p_club_id)
  ) then
    return json_build_object(
      'success', false,
      'error', 'Club already in war'
    );
  end if;

  -- trouver un club adverse
  select id
  into opponent
  from clubs
  where id != p_club_id
  order by total_xp desc
  limit 1;

  if opponent is null then
    return json_build_object(
      'success', false,
      'error', 'No opponent found'
    );
  end if;

  -- créer la war
  insert into club_wars (
    challenger_id,
    defender_id,
    status,
    challenger_xp,
    defender_xp
  )
  values (
    p_club_id,
    opponent,
    'active',
    0,
    0
  )
  returning id into war_id;

  return json_build_object(
    'success', true,
    'war_id', war_id
  );

end;
$$;


ALTER FUNCTION public.create_club_war(p_club_id uuid) OWNER TO postgres;

--
-- Name: create_join_request(uuid, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_join_request(p_club_id uuid, p_message text DEFAULT NULL::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_existing_member uuid;
  v_existing_request uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return json_build_object('success', false, 'error', 'Not authenticated');
  end if;

  -- Already member?
  select id into v_existing_member
  from club_members
  where club_id = p_club_id and user_id = v_user_id
  limit 1;

  if v_existing_member is not null then
    return json_build_object('success', false, 'error', 'Already a member');
  end if;

  -- Existing pending request?
  select id into v_existing_request
  from club_join_requests
  where club_id = p_club_id
    and user_id = v_user_id
    and status = 'pending'
  limit 1;

  if v_existing_request is not null then
    return json_build_object('success', false, 'error', 'Request already pending');
  end if;

  insert into club_join_requests (
    club_id,
    user_id,
    message,
    status
  )
  values (
    p_club_id,
    v_user_id,
    p_message,
    'pending'
  );

  return json_build_object('success', true);

exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;


ALTER FUNCTION public.create_join_request(p_club_id uuid, p_message text) OWNER TO postgres;

--
-- Name: create_prediction_secure(text, text, numeric, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance BIGINT;
  v_new_balance BIGINT;
  v_potential_winnings INTEGER;
  v_prediction_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Validation
  IF p_stake_amount <= 0 OR p_stake_amount > 1000 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid stake amount (1-1000)');
  END IF;

  -- Calculer gains potentiels
  v_potential_winnings := FLOOR(p_stake_amount * p_odds);

  -- Récupérer balance avec verrou
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Vérifier solde suffisant
  IF v_current_balance < p_stake_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_current_balance,
      'required', p_stake_amount
    );
  END IF;

  v_new_balance := v_current_balance - p_stake_amount;

  -- Mettre à jour le profil
  UPDATE profiles
  SET arena_balance = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Logger la mise
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (
    v_user_id,
    -p_stake_amount::bigint,
    'prediction_loss',
    'Prediction stake for match ' || p_match_id,
    p_match_id
  );

  -- Créer la prédiction
  INSERT INTO predictions (
    user_id,
    match_id,
    selected_team,
    odds,
    stake_amount,
    potential_winnings,
    status
  )
  VALUES (
    v_user_id,
    p_match_id,
    p_selected_team,
    p_odds,
    p_stake_amount,
    v_potential_winnings,
    'pending'
  )
  RETURNING id INTO v_prediction_id;

  RETURN json_build_object(
    'success', true,
    'prediction_id', v_prediction_id,
    'new_balance', v_new_balance,
    'potential_winnings', v_potential_winnings
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) OWNER TO postgres;

--
-- Name: FUNCTION create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) IS 'Créer une prédiction avec débitage automatique du stake';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: club_wars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_wars (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    challenger_id uuid NOT NULL,
    defender_id uuid NOT NULL,
    winner_id uuid,
    status text DEFAULT 'pending'::text NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    challenger_xp integer DEFAULT 0 NOT NULL,
    defender_xp integer DEFAULT 0 NOT NULL,
    challenger_predictions integer DEFAULT 0 NOT NULL,
    defender_predictions integer DEFAULT 0 NOT NULL,
    challenger_wins integer DEFAULT 0 NOT NULL,
    defender_wins integer DEFAULT 0 NOT NULL,
    xp_reward integer DEFAULT 200 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    territory_id uuid NOT NULL,
    season_id uuid,
    territory_name text,
    coordinates double precision[],
    attacker_score integer DEFAULT 0,
    defender_score integer DEFAULT 0,
    CONSTRAINT no_self_war CHECK ((challenger_id <> defender_id)),
    CONSTRAINT valid_territory CHECK ((territory_id IS NOT NULL))
);


ALTER TABLE public.club_wars OWNER TO postgres;

--
-- Name: create_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_war(p_club uuid) RETURNS public.club_wars
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_user_id uuid;
  v_membership_role text;
  v_existing_war_id uuid;
  v_opponent_id uuid;
  v_territory_id uuid;
  v_new_war public.club_wars;
begin
  -- 🔒 Auth obligatoire
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- 🔒 Vérifier que l'utilisateur est admin/owner du club demandeur
  select cm.role
    into v_membership_role
  from club_members cm
  where cm.club_id = p_club
    and cm.user_id = v_user_id
    and cm.role in ('owner', 'admin')
  limit 1;

  if v_membership_role is null then
    raise exception 'Not allowed to create war for this club';
  end if;

  -- 🔒 Lock logique : vérifier que le club n'est pas déjà engagé
  select cw.id
    into v_existing_war_id
  from club_wars cw
  where cw.status = 'active'
    and (cw.challenger_id = p_club or cw.defender_id = p_club)
  limit 1
  for update;

  if v_existing_war_id is not null then
    raise exception 'Club already in an active war';
  end if;

  -- 🔒 Choisir un adversaire libre
  select c.id
    into v_opponent_id
  from clubs c
  where c.id <> p_club
    and not exists (
      select 1
      from club_wars cw
      where cw.status = 'active'
        and (cw.challenger_id = c.id or cw.defender_id = c.id)
    )
  order by c.created_at asc nulls last, c.id asc
  limit 1
  for update of c skip locked;

  if v_opponent_id is null then
    raise exception 'No opponent available';
  end if;

  -- 🔒 Choisir un territoire libre
  select t.id
    into v_territory_id
  from club_territories t
  where not exists (
    select 1
    from club_wars cw
    where cw.status = 'active'
      and cw.territory_id = t.id
  )
  order by t.created_at asc nulls last, t.id asc
  limit 1
  for update of t skip locked;

  if v_territory_id is null then
    raise exception 'No territory available';
  end if;

  -- 🔒 Insertion atomique
  insert into club_wars (
    challenger_id,
    defender_id,
    territory_id,
    status,
    challenger_xp,
    defender_xp
  )
  values (
    p_club,
    v_opponent_id,
    v_territory_id,
    'active',
    0,
    0
  )
  returning *
  into v_new_war;

  return v_new_war;
end;
$$;


ALTER FUNCTION public.create_war(p_club uuid) OWNER TO postgres;

--
-- Name: decline_alliance_invite(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.decline_alliance_invite(p_invite_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  update public.alliance_invites
  set
    status = 'declined',
    responded_at = now()
  where id = p_invite_id
    and status = 'pending';
end;
$$;


ALTER FUNCTION public.decline_alliance_invite(p_invite_id uuid) OWNER TO postgres;

--
-- Name: dispatch_next_unit_orders(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dispatch_next_unit_orders() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  r record;
  v_count integer := 0;
begin
  for r in
    select
      o.id as order_id,
      o.unit_id,
      o.target_territory_id
    from public.unit_orders o
    join public.club_units u
      on u.id = o.unit_id
    where o.status = 'queued'
      and u.status = 'idle'
    order by
      o.priority desc,
      o.created_at asc,
      o.position asc
  loop
    perform public.move_unit(r.unit_id, r.target_territory_id);

    update public.unit_orders
    set status = 'started',
        started_at = now()
    where id = r.order_id;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.dispatch_next_unit_orders() OWNER TO postgres;

--
-- Name: end_active_season_and_distribute_rewards(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_active_season_and_distribute_rewards() RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_season_id uuid;
begin
  select id
  into v_season_id
  from public.seasons
  where is_active = true
  limit 1;

  if v_season_id is null then
    raise exception 'No active season found';
  end if;

  update public.seasons
  set
    is_active = false,
    status = 'finished',
    end_date = now()
  where id = v_season_id;

  insert into public.arena_ledger (
    user_id,
    amount,
    source,
    description,
    created_at
  )
  select
    spl.user_id,
    case
      when spl.rank = 1 then 1000
      when spl.rank = 2 then 500
      when spl.rank = 3 then 250
      else 0
    end,
    'season_reward',
    'Season reward rank #' || spl.rank,
    now()
  from public.active_season_player_leaderboard spl
  where spl.rank in (1, 2, 3);

  return v_season_id;
end;
$$;


ALTER FUNCTION public.end_active_season_and_distribute_rewards() OWNER TO postgres;

--
-- Name: end_club_season(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_club_season() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_old_season uuid;
  v_new_season uuid;
  v_top record;
begin

  -- 1️⃣ Saison active actuelle
  select id into v_old_season
  from seasons
  where is_active = true
  limit 1;

  if v_old_season is null then
    return;
  end if;

  -- 2️⃣ Récompenser Top 3
  for v_top in
    select *
    from club_season_leaderboard
    where season_id = v_old_season
    order by rank
    limit 3
  loop

    update clubs
    set total_xp = total_xp + (5000 / v_top.rank)
    where id = v_top.club_id;

  end loop;

  -- 3️⃣ Promotions / Relegations
  perform public.apply_club_promotions(v_old_season);

  -- 4️⃣ Fermer ancienne saison
  update seasons
  set is_active = false
  where id = v_old_season;

  -- 5️⃣ Créer nouvelle saison
  insert into seasons (
    name,
    start_date,
    end_date,
    is_active
  )
  values (
    'Season ' || extract(epoch from now()),
    now(),
    now() + interval '30 days',
    true
  )
  returning id into v_new_season;

  -- 6️⃣ Préparer club_season_stats pour nouvelle saison
  insert into club_season_stats (
    season_id,
    club_id,
    war_wins,
    war_losses,
    war_draws,
    war_xp,
    season_score,
    tier
  )
  select
    v_new_season,
    club_id,
    0,
    0,
    0,
    0,
    0,
    tier  -- conserve division après promotion
  from club_season_stats
  where season_id = v_old_season;

end;
$$;


ALTER FUNCTION public.end_club_season() OWNER TO postgres;

--
-- Name: end_current_season(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_current_season() RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_season RECORD;
  v_rank RECORD;
BEGIN

  -- =============================
  -- GET ACTIVE SEASON
  -- =============================
  SELECT * INTO v_season
  FROM seasons
  WHERE is_active = true
  LIMIT 1;

  IF v_season IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No active season');
  END IF;

  -- =============================
  -- REWARD TOP 3
  -- =============================
  FOR v_rank IN
    SELECT user_id, xp,
           RANK() OVER (ORDER BY xp DESC) as rank
    FROM season_xp
    WHERE season_id = v_season.id
    ORDER BY xp DESC
    LIMIT 3
  LOOP

    IF v_rank.rank = 1 THEN
      -- 1st place
      PERFORM public.add_xp(v_rank.user_id, 500);
      UPDATE profiles SET arena_balance = arena_balance + 1000 WHERE user_id = v_rank.user_id;
      INSERT INTO user_badges(user_id, badge_type, season_id)
      VALUES (v_rank.user_id, 'Season Champion', v_season.id);

    ELSIF v_rank.rank = 2 THEN
      -- 2nd place
      PERFORM public.add_xp(v_rank.user_id, 300);
      UPDATE profiles SET arena_balance = arena_balance + 600 WHERE user_id = v_rank.user_id;
      INSERT INTO user_badges(user_id, badge_type, season_id)
      VALUES (v_rank.user_id, 'Season Runner-up', v_season.id);

    ELSIF v_rank.rank = 3 THEN
      -- 3rd place
      PERFORM public.add_xp(v_rank.user_id, 150);
      UPDATE profiles SET arena_balance = arena_balance + 300 WHERE user_id = v_rank.user_id;
      INSERT INTO user_badges(user_id, badge_type, season_id)
      VALUES (v_rank.user_id, 'Season Top 3', v_season.id);
    END IF;

  END LOOP;

  -- =============================
  -- CLOSE SEASON
  -- =============================
  UPDATE seasons
  SET is_active = false
  WHERE id = v_season.id;

  RETURN json_build_object(
    'success', true,
    'season_closed', v_season.name
  );

END;
$$;


ALTER FUNCTION public.end_current_season() OWNER TO postgres;

--
-- Name: end_expired_club_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_expired_club_wars() RETURNS void
    LANGUAGE plpgsql
    AS $$
begin

update club_wars
set
status = 'finished',
winner_id =
case
when challenger_wins > defender_wins then challenger_id
when defender_wins > challenger_wins then defender_id
else null
end

where status = 'active'
and start_date < now() - interval '24 hours';

end;
$$;


ALTER FUNCTION public.end_expired_club_wars() OWNER TO postgres;

--
-- Name: end_expired_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_expired_wars() RETURNS void
    LANGUAGE plpgsql
    AS $$
begin

update club_wars
set
  status = 'finished',
  winner_id =
    case
      when challenger_xp > defender_xp then challenger_id
      when defender_xp > challenger_xp then defender_id
      else null
    end
where status = 'active'
and created_at < now() - interval '48 hours';

end;
$$;


ALTER FUNCTION public.end_expired_wars() OWNER TO postgres;

--
-- Name: end_season(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.end_season() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_season_id uuid;
BEGIN

  -- 1️⃣ Get active season
  select id into v_season_id
  from seasons
  where is_active = true
  limit 1;

  if v_season_id is null then
    raise exception 'No active season found';
  end if;

  -- 2️⃣ Archive Top 3
  insert into season_hall_of_fame (
    season_id,
    season_name,
    user_id,
    username,
    rank,
    xp,
    reward
  )
  select
    s.id,
    s.name,
    ranked.user_id,
    p.username,
    ranked.rank_position,
    ranked.xp,
    case 
      when ranked.rank_position = 1 then 1000
      when ranked.rank_position = 2 then 500
      when ranked.rank_position = 3 then 250
    end
  from (
    select 
      user_id,
      xp,
      rank() over (order by xp desc) as rank_position
    from season_xp
    where season_id = v_season_id
  ) ranked
  join seasons s on s.id = v_season_id
  join profiles p on p.user_id = ranked.user_id
  where ranked.rank_position <= 3;

  -- 3️⃣ Reward + Save rank
  update profiles
  set 
    arena_balance = arena_balance + reward_data.reward,
    last_season_rank = reward_data.rank_position,
    season_wins = case 
        when reward_data.rank_position = 1 
        then season_wins + 1 
        else season_wins 
      end
  from (
    select 
      user_id,
      rank_position,
      case 
        when rank_position = 1 then 1000
        when rank_position = 2 then 500
        when rank_position = 3 then 250
      end as reward
    from (
      select 
        user_id,
        rank() over (order by xp desc) as rank_position
      from season_xp
      where season_id = v_season_id
    ) ranked
    where rank_position <= 3
  ) reward_data
  where profiles.user_id = reward_data.user_id;

  -- 4️⃣ Reset season XP
  delete from season_xp
  where season_id = v_season_id;

  -- 5️⃣ Close season
  update seasons
  set 
    is_active = false,
    end_date = now()
  where id = v_season_id;

  -- 6️⃣ Create new season
  insert into seasons (
    name,
    start_date,
    end_date,
    is_active,
    created_at
  )
  values (
    'Season ' || extract(month from now()) || '-' || extract(year from now()),
    now(),
    now() + interval '30 days',
    true,
    now()
  );

END;
$$;


ALTER FUNCTION public.end_season() OWNER TO postgres;

--
-- Name: ensure_owner_membership(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.ensure_owner_membership(p_club_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_owner_id uuid;
  v_existing_id uuid;
begin
  -- Get current authenticated user
  v_user_id := auth.uid();

  if v_user_id is null then
    return json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  end if;

  -- Get club owner
  select owner_id
  into v_owner_id
  from clubs
  where id = p_club_id;

  if v_owner_id is null then
    return json_build_object(
      'success', false,
      'error', 'Club not found'
    );
  end if;

  -- Only owner can auto-join as owner
  if v_owner_id <> v_user_id then
    return json_build_object(
      'success', false,
      'error', 'Not club owner'
    );
  end if;

  -- Check if membership already exists
  select id
  into v_existing_id
  from club_members
  where club_id = p_club_id
    and user_id = v_user_id
  limit 1;

  if v_existing_id is not null then
    return json_build_object('success', true);
  end if;

  -- Insert owner membership
  insert into club_members (
    club_id,
    user_id,
    role,
    xp_contributed
  )
  values (
    p_club_id,
    v_user_id,
    'owner',
    0
  );

  return json_build_object('success', true);

exception when others then
  return json_build_object(
    'success', false,
    'error', SQLERRM
  );
end;
$$;


ALTER FUNCTION public.ensure_owner_membership(p_club_id uuid) OWNER TO postgres;

--
-- Name: find_opponent(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_opponent(p_club_id uuid) RETURNS uuid
    LANGUAGE sql
    AS $$
select id
from clubs
where id != p_club_id
order by random()
limit 1
$$;


ALTER FUNCTION public.find_opponent(p_club_id uuid) OWNER TO postgres;

--
-- Name: find_war_opponent(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.find_war_opponent(p_club_id uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$

declare
v_opponent uuid;

begin

select id
into v_opponent
from clubs
where id != p_club_id
and id not in (
  select challenger_id from club_wars where status = 'active'
  union
  select defender_id from club_wars where status = 'active'
)
order by total_xp desc
limit 1;

return v_opponent;

end;

$$;


ALTER FUNCTION public.find_war_opponent(p_club_id uuid) OWNER TO postgres;

--
-- Name: finish_active_club_season(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.finish_active_club_season() RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_season_id uuid;
begin
  select id
  into v_season_id
  from club_seasons
  where status = 'active'
  limit 1;

  if v_season_id is null then
    return json_build_object(
      'success', false,
      'error', 'No active season'
    );
  end if;

  with ranked as (
    select
      id,
      rank() over (
        order by total_xp desc, total_wins desc, total_predictions desc
      ) as computed_rank
    from club_season_rankings
    where season_id = v_season_id
  )
  update club_season_rankings csr
  set rank = ranked.computed_rank,
      updated_at = now()
  from ranked
  where csr.id = ranked.id;

  update club_seasons
  set status = 'finished',
      updated_at = now()
  where id = v_season_id;

  return json_build_object(
    'success', true,
    'season_id', v_season_id
  );
end;
$$;


ALTER FUNCTION public.finish_active_club_season() OWNER TO postgres;

--
-- Name: finish_expired_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.finish_expired_wars() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  v_war record;
  v_winner uuid;
  v_loser uuid;
  v_active_season uuid;
begin

  -- Saison active
  select id into v_active_season
  from seasons
  where is_active = true
  limit 1;

  for v_war in
    select *
    from club_wars
    where status = 'active'
      and end_date <= now()
  loop

    -- Déterminer gagnant
    if v_war.challenger_xp > v_war.defender_xp then
      v_winner := v_war.challenger_id;
      v_loser := v_war.defender_id;
    elsif v_war.defender_xp > v_war.challenger_xp then
      v_winner := v_war.defender_id;
      v_loser := v_war.challenger_id;
    else
      v_winner := null;
      v_loser := null;
    end if;

    -- Marquer war comme terminée
    update club_wars
    set status = 'finished',
        winner_id = v_winner
    where id = v_war.id;

    if v_active_season is not null then

      -- Assurer existence stats saison
      insert into club_season_stats (season_id, club_id)
      values (v_active_season, v_war.challenger_id)
      on conflict do nothing;

      insert into club_season_stats (season_id, club_id)
      values (v_active_season, v_war.defender_id)
      on conflict do nothing;

      -- Accumuler WAR XP
      update club_season_stats
      set war_xp = war_xp + v_war.challenger_xp
      where season_id = v_active_season
        and club_id = v_war.challenger_id;

      update club_season_stats
      set war_xp = war_xp + v_war.defender_xp
      where season_id = v_active_season
        and club_id = v_war.defender_id;

      -- Win / Loss / Draw
      if v_winner is not null then

        update club_season_stats
        set war_wins = war_wins + 1
        where season_id = v_active_season
          and club_id = v_winner;

        update club_season_stats
        set war_losses = war_losses + 1
        where season_id = v_active_season
          and club_id = v_loser;

      else

        update club_season_stats
        set war_draws = war_draws + 1
        where season_id = v_active_season
          and club_id in (v_war.challenger_id, v_war.defender_id);

      end if;

      -- Recalcul season_score hybride
      update club_season_stats
      set season_score =
            (war_wins * 1000)
          + war_xp
          - (war_losses * 300)
      where season_id = v_active_season;

      -- 🔥 UPDATE ELO
      perform public.update_club_elo(
        v_active_season,
        v_war.challenger_id,
        v_war.defender_id,
        v_winner
      );

      -- Recalculate tiers
      perform public.recalculate_club_tier(v_active_season, v_war.challenger_id);
      perform public.recalculate_club_tier(v_active_season, v_war.defender_id);

    end if;

  end loop;

end;
$$;


ALTER FUNCTION public.finish_expired_wars() OWNER TO postgres;

--
-- Name: generate_referral_code(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_referral_code(p_user uuid) RETURNS text
    LANGUAGE plpgsql
    AS $$
declare
  v_code text;
begin

v_code := upper(substr(md5(random()::text),1,6));

insert into referral_codes(user_id,code)
values(p_user,v_code);

return v_code;

end;
$$;


ALTER FUNCTION public.generate_referral_code(p_user uuid) OWNER TO postgres;

--
-- Name: generate_weekly_club_rankings(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_weekly_club_rankings() RETURNS void
    LANGUAGE plpgsql
    AS $$
begin

insert into club_weekly_rankings (
club_id,
total_xp,
total_predictions,
total_wins,
accuracy,
week_start,
week_end
)

select
id,
total_xp,
total_predictions,
total_wins,

case
when total_predictions > 0
then (total_wins::decimal / total_predictions) * 100
else 0
end,

date_trunc('week', now()),
date_trunc('week', now()) + interval '7 days'

from clubs;

end;
$$;


ALTER FUNCTION public.generate_weekly_club_rankings() OWNER TO postgres;

--
-- Name: get_allied_support_bonus(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_allied_support_bonus(p_territory_id uuid, p_club_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_bonus integer := 0;
begin
  select count(*)::integer
  into v_bonus
  from public.territory_adjacency ta
  join public.club_territories t
    on t.id = ta.adjacent_territory_id
  join public.alliance_members am_target
    on am_target.club_id = p_club_id
  join public.alliance_members am_adjacent
    on am_adjacent.club_id = t.controlling_club_id
   and am_adjacent.alliance_id = am_target.alliance_id
  where ta.territory_id = p_territory_id;

  return coalesce(v_bonus, 0);
end;
$$;


ALTER FUNCTION public.get_allied_support_bonus(p_territory_id uuid, p_club_id uuid) OWNER TO postgres;

--
-- Name: get_arena_balance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_arena_balance() RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_balance int := 0;
begin

  if auth.uid() is null then
    return json_build_object(
      'success', false,
      'error', 'Not authenticated'
    );
  end if;

  select coalesce(sum(amount), 0)
  into v_balance
  from arena_ledger
  where user_id = auth.uid();

  return json_build_object(
    'success', true,
    'balance', v_balance,
    'streak', 0,
    'score', 0
  );

end;
$$;


ALTER FUNCTION public.get_arena_balance() OWNER TO postgres;

--
-- Name: FUNCTION get_arena_balance(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.get_arena_balance() IS 'Récupérer le solde ARENA et les stats de l''utilisateur';


--
-- Name: get_attackable_territories(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_attackable_territories(p_club uuid) RETURNS TABLE(territory_id uuid)
    LANGUAGE sql
    AS $$
select distinct
    case
        when t1.controlling_club_id = p_club then tc.territory_b
        else tc.territory_a
    end as territory_id
from territory_connections tc
join club_territories t1
    on t1.id = tc.territory_a
join club_territories t2
    on t2.id = tc.territory_b
where
    (
        t1.controlling_club_id = p_club
        and (t2.controlling_club_id is null or t2.controlling_club_id <> p_club)
    )
    or
    (
        t2.controlling_club_id = p_club
        and (t1.controlling_club_id is null or t1.controlling_club_id <> p_club)
    );
$$;


ALTER FUNCTION public.get_attackable_territories(p_club uuid) OWNER TO postgres;

--
-- Name: get_club_detail(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_club_detail(p_slug text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_club record;
  v_members json;
  v_my_membership json;
  v_active_war json;
begin

select *
into v_club
from clubs
where slug = p_slug;

select json_agg(cm)
into v_members
from club_members cm
where cm.club_id = v_club.id;

select to_json(cm)
into v_my_membership
from club_members cm
where cm.club_id = v_club.id
and cm.user_id = auth.uid();

select to_json(cw)
into v_active_war
from club_wars cw
where cw.status = 'active'
and (cw.challenger_id = v_club.id or cw.defender_id = v_club.id)
limit 1;

return json_build_object(
  'club', v_club,
  'members', coalesce(v_members,'[]'::json),
  'my_membership', v_my_membership,
  'active_war', v_active_war
);

end;
$$;


ALTER FUNCTION public.get_club_detail(p_slug text) OWNER TO postgres;

--
-- Name: get_club_leaderboard(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_club_leaderboard() RETURNS TABLE(club_id uuid, club_name text, territories integer, capitals integer, wins integer)
    LANGUAGE sql
    AS $$
select
  c.id as club_id,
  c.name as club_name,

  count(t.id) filter (
    where t.controlling_club_id = c.id
  ) as territories,

  count(t.id) filter (
    where t.controlling_club_id = c.id
    and t.is_capital = true
  ) as capitals,

  count(w.id) filter (
    where w.winner_id = c.id
  ) as wins

from clubs c

left join club_territories t
  on t.controlling_club_id = c.id

left join club_wars w
  on w.winner_id = c.id

group by c.id, c.name

order by territories desc, capitals desc, wins desc;
$$;


ALTER FUNCTION public.get_club_leaderboard() OWNER TO postgres;

--
-- Name: get_dashboard_data(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_dashboard_data(p_user_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_club json;
  v_leaderboard json;
  v_matches json;
begin

  -- club
  select json_build_object(
    'id', c.id,
    'name', c.name
  )
  into v_club
  from club_members cm
  join clubs c on c.id = cm.club_id
  where cm.user_id = p_user_id
  limit 1;

  -- leaderboard
  select json_agg(row_to_json(t))
  into v_leaderboard
  from (
    select
      p.username,
      sx.xp
    from season_xp sx
    join profiles p on p.id = sx.user_id
    order by sx.xp desc
    limit 10
  ) t;

  -- matches
  select json_agg(row_to_json(m))
  into v_matches
  from (
    select
      id,
      team_a,
      team_b
    from matches
    limit 5
  ) m;

  return json_build_object(
    'club', v_club,
    'leaderboard', v_leaderboard,
    'matches', v_matches
  );

end;
$$;


ALTER FUNCTION public.get_dashboard_data(p_user_id uuid) OWNER TO postgres;

--
-- Name: get_path(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_path(start_id uuid, end_id uuid) RETURNS TABLE(step uuid)
    LANGUAGE sql
    AS $$
with recursive path as (
  select
    ta.territory_id,
    ta.adjacent_territory_id,
    array[ta.territory_id] as visited
  from territory_adjacency ta
  where ta.territory_id = start_id

  union all

  select
    ta.territory_id,
    ta.adjacent_territory_id,
    p.visited || ta.territory_id
  from territory_adjacency ta
  join path p on p.adjacent_territory_id = ta.territory_id
  where not ta.territory_id = any(p.visited)
)
select adjacent_territory_id as step
from path
where adjacent_territory_id = end_id
limit 10;
$$;


ALTER FUNCTION public.get_path(start_id uuid, end_id uuid) OWNER TO postgres;

--
-- Name: get_player_leaderboard(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_player_leaderboard() RETURNS TABLE(username text, xp integer)
    LANGUAGE sql
    AS $$
select
  p.username,
  sx.xp
from season_xp sx
join profiles p on p.id = sx.user_id
order by sx.xp desc
limit 20;
$$;


ALTER FUNCTION public.get_player_leaderboard() OWNER TO postgres;

--
-- Name: get_player_level(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_player_level(p_xp integer) RETURNS integer
    LANGUAGE sql
    AS $$
select
case
when p_xp >= 2000 then 4
when p_xp >= 1200 then 3
when p_xp >= 500 then 2
else 1
end
$$;


ALTER FUNCTION public.get_player_level(p_xp integer) OWNER TO postgres;

--
-- Name: get_season_leaderboard(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_season_leaderboard() RETURNS TABLE(user_id uuid, username text, avatar_url text, current_level integer, xp integer, rank bigint, tier text)
    LANGUAGE sql STABLE
    AS $$
with active_season as (
  select id
  from seasons
  where is_active = true
  limit 1
),
ranked as (
  select
    sx.user_id,
    p.username,
    p.avatar_url,
    p.current_level,
    sx.xp,
    rank() over (order by sx.xp desc) as rank
  from season_xp sx
  join profiles p on p.user_id = sx.user_id
  where sx.season_id = (select id from active_season)
)
select
  user_id,
  username,
  avatar_url,
  current_level,
  xp,
  rank,
  case
    when rank <= 100 then 'challenger'
    when xp >= 10000 then 'diamond'
    when xp >= 6000 then 'platinum'
    when xp >= 3000 then 'gold'
    when xp >= 1000 then 'silver'
    else 'bronze'
  end as tier
from ranked
order by rank asc;
$$;


ALTER FUNCTION public.get_season_leaderboard() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    discord_id,
    username,
    display_name,
    avatar_url
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$   SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
 $$;


ALTER FUNCTION public.has_role(_user_id uuid, _role public.app_role) OWNER TO postgres;

--
-- Name: increment_club_war_xp(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.increment_club_war_xp(p_club_id uuid, p_xp integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  v_war_id uuid;
begin
  -- Trouver une war active impliquant ce club
  select id into v_war_id
  from club_wars
  where status = 'active'
    and (challenger_id = p_club_id or defender_id = p_club_id)
  limit 1;

  -- Si aucune war active → on ne fait rien
  if v_war_id is null then
    return;
  end if;

  -- Incrémenter le bon côté
  update club_wars
  set
    challenger_xp = case 
      when challenger_id = p_club_id 
      then challenger_xp + p_xp 
      else challenger_xp 
    end,
    defender_xp = case 
      when defender_id = p_club_id 
      then defender_xp + p_xp 
      else defender_xp 
    end,
    updated_at = now()
  where id = v_war_id;

end;
$$;


ALTER FUNCTION public.increment_club_war_xp(p_club_id uuid, p_xp integer) OWNER TO postgres;

--
-- Name: is_user_banned(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$   SELECT EXISTS (
    SELECT 1 FROM club_banned_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
  )
 $$;


ALTER FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid) OWNER TO postgres;

--
-- Name: is_user_muted(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$   SELECT EXISTS (
    SELECT 1 FROM club_muted_members
    WHERE club_id = p_club_id
    AND user_id = p_user_id
    AND expires_at > now()
  )
 $$;


ALTER FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid) OWNER TO postgres;

--
-- Name: move_unit(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.move_unit(p_unit_id uuid, p_to_territory_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_from_territory_id uuid;
  v_speed integer;
  v_movement_id uuid;
begin
  select territory_id, speed
  into v_from_territory_id, v_speed
  from public.club_units
  where id = p_unit_id;

  if v_from_territory_id is null then
    raise exception 'Unit not found';
  end if;

  if not exists (
    select 1
    from public.territory_adjacency
    where territory_id = v_from_territory_id
      and adjacent_territory_id = p_to_territory_id
  ) then
    raise exception 'Invalid movement: target territory is not adjacent';
  end if;

  insert into public.unit_movements (
    unit_id,
    from_territory_id,
    to_territory_id,
    status,
    started_at,
    arrival_at
  )
  values (
    p_unit_id,
    v_from_territory_id,
    p_to_territory_id,
    'moving',
    now(),
    now() + make_interval(mins => greatest(1, 6 - coalesce(v_speed, 1)))
  )
  returning id into v_movement_id;

  update public.club_units
  set
    status = 'moving',
    updated_at = now()
  where id = p_unit_id;

  return v_movement_id;
end;
$$;


ALTER FUNCTION public.move_unit(p_unit_id uuid, p_to_territory_id uuid) OWNER TO postgres;

--
-- Name: process_unit_movement_tick(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.process_unit_movement_tick() RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  m record;
  next_node uuid;
  path_length int;
begin

  for m in
    select um.*, uo.path
    from public.unit_movements um
    join public.unit_orders uo on uo.unit_id = um.unit_id
    where um.status = 'moving'
  loop

    update public.unit_movements
    set progress = coalesce(progress, 0) + 0.1,
        updated_at = now()
    where id = m.id;

    if m.progress >= 1 then

      path_length := array_length(m.path, 1);

      if m.current_index + 1 >= path_length then
        update public.unit_movements
        set status = 'arrived'
        where id = m.id;

      else
        next_node := m.path[m.current_index + 2];

        update public.unit_movements
        set
          current_index = m.current_index + 1,
          from_territory_id = m.to_territory_id,
          to_territory_id = next_node,
          progress = 0
        where id = m.id;
      end if;

    end if;

  end loop;

end;
$$;


ALTER FUNCTION public.process_unit_movement_tick() OWNER TO postgres;

--
-- Name: queue_unit_order(uuid, uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer DEFAULT NULL::integer) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_position integer;
  v_order_id uuid;
begin
  if p_position is null then
    select coalesce(max(position), 0) + 1
    into v_position
    from public.unit_orders
    where unit_id = p_unit_id
      and status in ('queued', 'started');
  else
    v_position := p_position;
  end if;

  insert into public.unit_orders (
    unit_id,
    target_territory_id,
    position,
    status
  )
  values (
    p_unit_id,
    p_target_territory_id,
    v_position,
    'queued'
  )
  returning id into v_order_id;

  return v_order_id;
end;
$$;


ALTER FUNCTION public.queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer) OWNER TO postgres;

--
-- Name: recalculate_club_tier(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recalculate_club_tier(p_season_id uuid, p_club_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_score integer;
  v_tier text;
begin

  select season_score
  into v_score
  from club_season_stats
  where season_id = p_season_id
  and club_id = p_club_id;

  if v_score >= 15000 then
    v_tier := 'challenger';
  elsif v_score >= 10000 then
    v_tier := 'diamond';
  elsif v_score >= 6000 then
    v_tier := 'platinum';
  elsif v_score >= 3000 then
    v_tier := 'gold';
  elsif v_score >= 1000 then
    v_tier := 'silver';
  else
    v_tier := 'bronze';
  end if;

  update club_season_stats
  set tier = v_tier,
      updated_at = now()
  where season_id = p_season_id
  and club_id = p_club_id;

end;
$$;


ALTER FUNCTION public.recalculate_club_tier(p_season_id uuid, p_club_id uuid) OWNER TO postgres;

--
-- Name: redeem_prize(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.redeem_prize(p_prize_id integer) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  user_balance INT;
  prize_cost INT;
  -- ...
BEGIN
  -- Vérifications côté serveur (OBLIGATOIRE)
  -- Transactions atomiques
  -- Logs d'audit
END;
$$;


ALTER FUNCTION public.redeem_prize(p_prize_id integer) OWNER TO postgres;

--
-- Name: redeem_prize_secure(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.redeem_prize_secure(p_prize_id integer) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_prize_name TEXT;
  v_prize_price INTEGER;
  v_prize_stock INTEGER;
  v_current_balance BIGINT;
  v_new_balance BIGINT;
  v_redemption_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Récupérer infos du prix avec verrou
  SELECT name, price_arena, stock
  INTO v_prize_name, v_prize_price, v_prize_stock
  FROM arena_prizes
  WHERE id = p_prize_id AND active = true
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Prize not found or inactive');
  END IF;

  -- Vérifier stock
  IF v_prize_stock IS NOT NULL AND v_prize_stock <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Prize out of stock');
  END IF;

  -- Récupérer balance utilisateur avec verrou
  SELECT arena_balance
  INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Vérifier solde suffisant
  IF v_current_balance < v_prize_price THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_current_balance,
      'required', v_prize_price
    );
  END IF;

  v_new_balance := v_current_balance - v_prize_price;

  -- Mettre à jour le profil
  UPDATE profiles
  SET arena_balance = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Décrémenter le stock si applicable
  IF v_prize_stock IS NOT NULL THEN
    UPDATE arena_prizes
    SET stock = stock - 1, updated_at = NOW()
    WHERE id = p_prize_id;
  END IF;

  -- Logger la dépense
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (
    v_user_id,
    -v_prize_price::bigint,
    'prize',
    'Prize redeemed: ' || v_prize_name,
    p_prize_id::text
  );

  -- Créer la redemption
  INSERT INTO prize_redemptions (
    user_id,
    prize_id,
    prize_name,
    price_paid,
    status
  )
  VALUES (
    v_user_id,
    p_prize_id,
    v_prize_name,
    v_prize_price,
    'pending'
  )
  RETURNING id INTO v_redemption_id;

  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'prize_name', v_prize_name,
    'redemption_id', v_redemption_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.redeem_prize_secure(p_prize_id integer) OWNER TO postgres;

--
-- Name: FUNCTION redeem_prize_secure(p_prize_id integer); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.redeem_prize_secure(p_prize_id integer) IS 'Racheter un prix avec vérification stock et balance';


--
-- Name: resolve_match(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_match(p_match_id text, p_winning_team text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_prediction RECORD;
  v_xp_result json;
  v_winnings numeric;
  v_resolved_count int := 0;
  v_won_count int := 0;
  v_lost_count int := 0;
BEGIN

  -- ================================
  -- SECURITY CHECK
  -- ================================
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Admin access required');
  END IF;

  -- ================================
  -- INPUT VALIDATION
  -- ================================
  IF p_match_id IS NULL OR p_match_id = '' THEN
    RETURN json_build_object('success', false, 'error', 'Match ID is required');
  END IF;

  IF p_winning_team IS NULL OR p_winning_team = '' THEN
    RETURN json_build_object('success', false, 'error', 'Winning team is required');
  END IF;

  -- ================================
  -- LOCK MATCH ROW (ANTI DOUBLE EXECUTION)
  -- ================================
  PERFORM 1
  FROM matches
  WHERE external_id = p_match_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Match not found');
  END IF;

  -- ================================
  -- MATCH VALIDATION
  -- ================================
  IF EXISTS (
    SELECT 1 FROM matches
    WHERE external_id = p_match_id
    AND resolved_at IS NOT NULL
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Match already resolved');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM matches
    WHERE external_id = p_match_id
    AND (team_a = p_winning_team OR team_b = p_winning_team)
  ) THEN
    RETURN json_build_object('success', false, 'error', 'Winning team does not match fixture');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM predictions
    WHERE match_id = p_match_id
    AND status = 'pending'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'No pending predictions found');
  END IF;

  -- ================================
  -- RESOLUTION LOOP
  -- ================================
  FOR v_prediction IN
    SELECT *
    FROM predictions
    WHERE match_id = p_match_id
    AND status = 'pending'
  LOOP

    v_resolved_count := v_resolved_count + 1;

    IF v_prediction.selected_team = p_winning_team THEN
      -- ================= WINNER =================
      v_won_count := v_won_count + 1;

      -- Secure calculation
      v_winnings := LEAST(
        v_prediction.stake_amount * v_prediction.odds,
        5000
     );

      UPDATE predictions
      SET status = 'won',
          resolved_at = now()
      WHERE id = v_prediction.id;

      UPDATE profiles
      SET arena_balance = arena_balance + v_winnings,
          total_wins = total_wins + 1,
          active_streak = active_streak + 1,
          prediction_accuracy = CASE
            WHEN total_predictions > 0
            THEN ROUND(((total_wins + 1)::numeric / total_predictions::numeric) * 100, 2)
            ELSE 100
          END,
          updated_at = now()
      WHERE user_id = v_prediction.user_id;

      INSERT INTO arena_ledger (
        user_id,
        amount,
        source,
        description,
        reference_id
      )
      VALUES (
        v_prediction.user_id,
        v_winnings,
        'prediction_win',
        'Match ' || p_match_id || ' - Victoire (' || p_winning_team || ')',
        v_prediction.id::text
      );

      SELECT public.add_xp(v_prediction.user_id, 50)
      INTO v_xp_result;

    ELSE
      -- ================= LOSER =================
      v_lost_count := v_lost_count + 1;

      UPDATE predictions
      SET status = 'lost',
          resolved_at = now()
      WHERE id = v_prediction.id;

      UPDATE profiles
      SET active_streak = 0,
          prediction_accuracy = CASE
            WHEN total_predictions > 0
            THEN ROUND((total_wins::numeric / total_predictions::numeric) * 100, 2)
            ELSE 0
          END,
          updated_at = now()
      WHERE user_id = v_prediction.user_id;

      INSERT INTO arena_ledger (
        user_id,
        amount,
        source,
        description,
        reference_id
      )
      VALUES (
        v_prediction.user_id,
        0,
        'prediction_loss',
        'Match ' || p_match_id || ' - Défaite (' || v_prediction.selected_team || ')',
        v_prediction.id::text
      );
    END IF;

  END LOOP;

  -- ================================
  -- MARK MATCH AS RESOLVED
  -- ================================
  UPDATE matches
SET winner = p_winning_team,
    resolved_at = now(),
    resolved_by = auth.uid()
WHERE external_id = p_match_id;

  -- ================================
  -- FINAL RESPONSE
  -- ================================
  RETURN json_build_object(
    'success', true,
    'match_id', p_match_id,
    'winning_team', p_winning_team,
    'resolved_count', v_resolved_count,
    'won_count', v_won_count,
    'lost_count', v_lost_count
  );

END;
$$;


ALTER FUNCTION public.resolve_match(p_match_id text, p_winning_team text) OWNER TO postgres;

--
-- Name: resolve_prediction(uuid, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_prediction RECORD;
  v_winnings BIGINT;
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN json_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Récupérer la prédiction
  SELECT * INTO v_prediction
  FROM predictions
  WHERE id = p_prediction_id AND status = 'pending'
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Prediction not found or already resolved');
  END IF;

  -- Si gagné, ajouter les gains
  IF p_won THEN
    v_winnings := v_prediction.potential_winnings;
    
    -- Créditer le compte
    UPDATE profiles
    SET arena_balance = arena_balance + v_winnings,
        total_wins = total_wins + 1,
        updated_at = NOW()
    WHERE user_id = v_prediction.user_id;

    -- Logger le gain
    INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
    VALUES (
      v_prediction.user_id,
      v_winnings,
      'prediction_win',
      'Prediction won for match ' || v_prediction.match_id,
      v_prediction.match_id
    );
  END IF;

  -- Mettre à jour le statut de la prédiction
  UPDATE predictions
  SET 
    status = CASE WHEN p_won THEN 'won' ELSE 'lost' END,
    resolved_at = NOW()
  WHERE id = p_prediction_id;

  -- Mettre à jour les stats du profil
  UPDATE profiles
  SET 
    total_predictions = total_predictions + 1,
    prediction_accuracy = (
      CASE WHEN total_predictions > 0 
      THEN (total_wins::numeric / total_predictions::numeric) * 100
      ELSE 0 END
    ),
    updated_at = NOW()
  WHERE user_id = v_prediction.user_id;

  RETURN json_build_object(
    'success', true,
    'won', p_won,
    'winnings', COALESCE(v_winnings, 0)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) OWNER TO postgres;

--
-- Name: FUNCTION resolve_prediction(p_prediction_id uuid, p_won boolean); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) IS 'Résoudre une prédiction (admin only) et distribuer les gains';


--
-- Name: resolve_territory_control(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_territory_control() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  r record;
begin
  for r in
    select territory_id,
           club_id,
           sum(power) as total_power
    from club_units
    group by territory_id, club_id
    order by territory_id, total_power desc
  loop
    update club_territories
    set controlling_club_id = r.club_id
    where id = r.territory_id;
  end loop;

  return 1;
end;
$$;


ALTER FUNCTION public.resolve_territory_control() OWNER TO postgres;

--
-- Name: resolve_territory_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_territory_war(p_war uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$

declare

v_attacker uuid;
v_defender uuid;
v_territory uuid;

xp_attacker integer;
xp_defender integer;

v_winner uuid;

begin

select challenger_id, defender_id, territory_id
into v_attacker, v_defender, v_territory
from club_wars
where id = p_war;

-- XP attacker
select coalesce(sum(wc.xp),0)
into xp_attacker
from war_contributions wc
join club_members cm
on cm.user_id = wc.user_id
where wc.war_id = p_war
and cm.club_id = v_attacker;

-- XP defender
select coalesce(sum(wc.xp),0)
into xp_defender
from war_contributions wc
join club_members cm
on cm.user_id = wc.user_id
where wc.war_id = p_war
and cm.club_id = v_defender;

-- winner
if xp_attacker >= xp_defender then
    v_winner := v_attacker;
else
    v_winner := v_defender;
end if;

-- capture territory
update club_territories
set controlling_club_id = v_winner
where id = v_territory;

-- close war
update club_wars
set status = 'finished'
where id = p_war;

return json_build_object(
    'success', true,
    'winner', v_winner,
    'attacker_xp', xp_attacker,
    'defender_xp', xp_defender
);

end;

$$;


ALTER FUNCTION public.resolve_territory_war(p_war uuid) OWNER TO postgres;

--
-- Name: resolve_unit_battle(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_unit_battle(p_territory uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  r record;
begin
  for r in
    select *
    from club_units
    where territory_id = p_territory
  loop
    update club_units
    set hp = greatest(
      0,
      hp - (
        power +
        case when random() < (crit_chance / 100.0)
          then power * 0.5
          else 0
        end
      )::int
    )
    where id <> r.id
      and territory_id = p_territory;
  end loop;

  delete from club_units
  where hp <= 0;
end;
$$;


ALTER FUNCTION public.resolve_unit_battle(p_territory uuid) OWNER TO postgres;

--
-- Name: resolve_unit_collisions(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_unit_collisions() RETURNS void
    LANGUAGE plpgsql
    AS $$
begin

  insert into public.battle_logs (
    territory_id,
    payload,
    created_at
  )
  select
    um.to_territory_id,
    jsonb_build_object(
      'type', 'collision',
      'timestamp', now()
    ),
    now()
  from public.unit_movements um
  join public.club_units u1 on u1.id = um.unit_id
  join public.club_units u2
    on u2.territory_id = um.to_territory_id
   and u2.club_id != u1.club_id;

end;
$$;


ALTER FUNCTION public.resolve_unit_collisions() OWNER TO postgres;

--
-- Name: resolve_unit_encounters(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_unit_encounters() RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare
  r record;
  v_count int := 0;
begin
  for r in
    select territory_id
    from club_units
    group by territory_id
    having count(distinct club_id) > 1
  loop
    -- simulation combat
    update club_units
    set power = greatest(0, power - floor(random() * 5)::int),
        status = 'engaged'
    where territory_id = r.territory_id;

    delete from club_units
    where territory_id = r.territory_id
      and power <= 0;

    insert into unit_encounters(territory_id)
    values (r.territory_id);

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.resolve_unit_encounters() OWNER TO postgres;

--
-- Name: resolve_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_war(p_war_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_attacker uuid;
  v_defender uuid;
  v_territory_id uuid;
  v_bonus_type text;
  v_bonus_value integer;
  v_attacker_xp integer;
  v_defender_xp integer;
  v_attacker_support integer;
  v_defender_support integer;
  v_winner uuid;
begin
  select challenger_id, defender_id, territory_id
  into v_attacker, v_defender, v_territory_id
  from public.club_wars
  where id = p_war_id;

  select
    coalesce(sum(case when club_id = v_attacker then xp end), 0),
    coalesce(sum(case when club_id = v_defender then xp end), 0)
  into v_attacker_xp, v_defender_xp
  from public.war_contributions
  where war_id = p_war_id;

  if v_territory_id is not null then
    select bonus_type, coalesce(bonus_value, 0)
    into v_bonus_type, v_bonus_value
    from public.club_territories
    where id = v_territory_id;

    if v_bonus_type = 'attack' then
      v_attacker_xp := floor(v_attacker_xp * (100 + v_bonus_value) / 100.0);
    elsif v_bonus_type = 'defense' then
      v_defender_xp := floor(v_defender_xp * (100 + v_bonus_value) / 100.0);
    elsif v_bonus_type = 'xp' then
      v_attacker_xp := floor(v_attacker_xp * (100 + v_bonus_value) / 100.0);
      v_defender_xp := floor(v_defender_xp * (100 + v_bonus_value) / 100.0);
    end if;

    v_attacker_support := public.get_allied_support_bonus(v_territory_id, v_attacker);
    v_defender_support := public.get_allied_support_bonus(v_territory_id, v_defender);

    v_attacker_xp := floor(v_attacker_xp * (100 + (v_attacker_support * 10)) / 100.0);
    v_defender_xp := floor(v_defender_xp * (100 + (v_defender_support * 10)) / 100.0);
  end if;

  if v_attacker_xp >= v_defender_xp then
    v_winner := v_attacker;
  else
    v_winner := v_defender;
  end if;

  if v_territory_id is not null then
    update public.club_territories
    set
      controlling_club_id = v_winner,
      capture_progress = 100,
      updated_at = now()
    where id = v_territory_id;
  end if;

  update public.club_wars
  set
    status = 'finished',
    winner_id = v_winner,
    challenger_xp = v_attacker_xp,
    defender_xp = v_defender_xp,
    end_date = now(),
    updated_at = now()
  where id = p_war_id;
end;
$$;


ALTER FUNCTION public.resolve_war(p_war_id uuid) OWNER TO postgres;

--
-- Name: resolve_war_capture(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_war_capture(p_war_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_attacker uuid;
  v_defender uuid;
  v_territory_id uuid;
  v_attacker_xp integer;
  v_defender_xp integer;
  v_winner uuid;
  v_old_owner uuid;
  v_gold_reward integer := 250;
  v_energy_reward integer := 25;
begin
  select challenger_id, defender_id, territory_id
  into v_attacker, v_defender, v_territory_id
  from public.club_wars
  where id = p_war_id;

  if v_territory_id is null then
    raise exception 'War territory not found';
  end if;

  select controlling_club_id
  into v_old_owner
  from public.club_territories
  where id = v_territory_id;

  select
    coalesce(sum(case when club_id = v_attacker then xp end), 0),
    coalesce(sum(case when club_id = v_defender then xp end), 0)
  into v_attacker_xp, v_defender_xp
  from public.war_contributions
  where war_id = p_war_id;

  if v_attacker_xp >= v_defender_xp then
    v_winner := v_attacker;
  else
    v_winner := v_defender;
  end if;

  update public.club_territories
  set
    controlling_club_id = v_winner,
    capture_progress = 100,
    updated_at = now()
  where id = v_territory_id;

  update public.club_wars
  set
    status = 'finished',
    winner_id = v_winner,
    challenger_xp = v_attacker_xp,
    defender_xp = v_defender_xp,
    end_date = now(),
    updated_at = now()
  where id = p_war_id;

  update public.clubs
  set
    gold = coalesce(gold, 0) + v_gold_reward,
    energy = coalesce(energy, 0) + v_energy_reward
  where id = v_winner;

  insert into public.user_notifications (
    user_id,
    type,
    title,
    message,
    value
  )
  select
    cm.user_id,
    'info',
    'Territory Captured',
    'Your club captured a territory',
    v_gold_reward::text
  from public.club_members cm
  where cm.club_id = v_winner;

  return v_winner;
end;
$$;


ALTER FUNCTION public.resolve_war_capture(p_war_id uuid) OWNER TO postgres;

--
-- Name: resolve_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.resolve_wars() RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
  update club_wars w
  set status = 'finished',
      winner_id = case
        when atk.total_xp > def.total_xp then w.challenger_id
        else w.defender_id
      end
  from (
    select war_id, sum(xp) as total_xp
    from war_contributions
    group by war_id
  ) atk,
  (
    select war_id, sum(xp) as total_xp
    from war_contributions
    group by war_id
  ) def
  where w.id = atk.war_id
    and w.id = def.war_id
    and w.status = 'active';
end;
$$;


ALTER FUNCTION public.resolve_wars() OWNER TO postgres;

--
-- Name: reward_war_winner(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reward_war_winner() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin

if new.status = 'finished' and new.winner_id is not null then

  update clubs
  set total_xp = total_xp + new.xp_reward
  where id = new.winner_id;

end if;

return new;

end;
$$;


ALTER FUNCTION public.reward_war_winner() OWNER TO postgres;

--
-- Name: reward_war_winner_with_territory(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reward_war_winner_with_territory(p_winner_club_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_territory_id uuid;
begin
  select id
  into v_territory_id
  from club_territories
  where controlling_club_id is distinct from p_winner_club_id
  order by random()
  limit 1;

  if v_territory_id is null then
    return json_build_object(
      'success', false,
      'error', 'No territory available'
    );
  end if;

  update club_territories
  set controlling_club_id = p_winner_club_id,
      updated_at = now()
  where id = v_territory_id;

  return json_build_object(
    'success', true,
    'territory_id', v_territory_id
  );
end;
$$;


ALTER FUNCTION public.reward_war_winner_with_territory(p_winner_club_id uuid) OWNER TO postgres;

--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION public.rls_auto_enable() OWNER TO postgres;

--
-- Name: run_all_battle_ticks(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.run_all_battle_ticks() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  r record;
  v_count integer := 0;
begin
  for r in
    select territory_id
    from public.club_units
    where territory_id is not null
    group by territory_id
    having count(distinct club_id) >= 2
  loop
    insert into public.battle_logs (
      territory_id,
      round,
      payload,
      created_at
    )
    values (
      r.territory_id,
      1,
      jsonb_build_object(
        'auto', true,
        'territory_id', r.territory_id,
        'timestamp', now()
      ),
      now()
    );

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.run_all_battle_ticks() OWNER TO postgres;

--
-- Name: run_military_ai(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.run_military_ai() RETURNS void
    LANGUAGE plpgsql
    AS $$
declare
  u record;
  enemy_power int;
begin
  for u in select * from club_units
  loop
    select coalesce(sum(power),0)
    into enemy_power
    from club_units
    where territory_id = u.territory_id
      and club_id <> u.club_id;

    if enemy_power > u.power then
      -- retreat
      update club_units
      set status = 'retreat'
      where id = u.id;
    else
      -- attack neighbors
      insert into unit_orders(unit_id, target_territory_id, priority)
      select u.id, ta.adjacent_territory_id, 5
      from territory_adjacency ta
      where ta.territory_id = u.territory_id
      limit 1;
    end if;
  end loop;
end;
$$;


ALTER FUNCTION public.run_military_ai() OWNER TO postgres;

--
-- Name: run_war_ai_turn(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.run_war_ai_turn() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_count integer := 0;
  r_war record;
  v_attack_xp integer;
  v_defend_xp integer;
begin
  for r_war in
    select id, challenger_id, defender_id
    from public.club_wars
    where status = 'active'
  loop
    v_attack_xp := 10 + floor(random() * 20)::integer;
    v_defend_xp := 10 + floor(random() * 20)::integer;

    insert into public.war_contributions (
      war_id,
      user_id,
      club_id,
      xp,
      created_at
    )
    values (
      r_war.id,
      null,
      r_war.challenger_id,
      v_attack_xp,
      now()
    );

    insert into public.war_contributions (
      war_id,
      user_id,
      club_id,
      xp,
      created_at
    )
    values (
      r_war.id,
      null,
      r_war.defender_id,
      v_defend_xp,
      now()
    );

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;


ALTER FUNCTION public.run_war_ai_turn() OWNER TO postgres;

--
-- Name: send_alliance_invite(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_invite_id uuid;
begin
  if exists (
    select 1
    from public.alliance_members
    where club_id = p_club_id
  ) then
    raise exception 'Target club already belongs to an alliance';
  end if;

  insert into public.alliance_invites (
    alliance_id,
    club_id,
    invited_by_club_id,
    status
  )
  values (
    p_alliance_id,
    p_club_id,
    p_invited_by_club_id,
    'pending'
  )
  on conflict (alliance_id, club_id)
  do update set
    status = 'pending',
    invited_by_club_id = excluded.invited_by_club_id,
    created_at = now(),
    responded_at = null
  returning id into v_invite_id;

  return v_invite_id;
end;
$$;


ALTER FUNCTION public.send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid) OWNER TO postgres;

--
-- Name: smart_matchmake_ranked_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.smart_matchmake_ranked_wars() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_season_id uuid;
  v_created_count integer := 0;
  r_attacker record;
  r_defender record;
  r_territory record;
begin
  select id
  into v_season_id
  from public.seasons
  where is_active = true
  limit 1;

  if v_season_id is null then
    raise exception 'No active season';
  end if;

  for r_attacker in
    select css.club_id, coalesce(css.elo_rating, 1000) as elo
    from public.club_season_stats css
    where css.season_id = v_season_id
      and not exists (
        select 1
        from public.club_wars w
        where w.status = 'active'
          and (w.challenger_id = css.club_id or w.defender_id = css.club_id)
      )
  loop
    select css.club_id, coalesce(css.elo_rating, 1000) as elo
    into r_defender
    from public.club_season_stats css
    where css.season_id = v_season_id
      and css.club_id <> r_attacker.club_id
      and abs(coalesce(css.elo_rating, 1000) - r_attacker.elo) <= 150
      and not exists (
        select 1
        from public.club_wars w
        where w.status = 'active'
          and (w.challenger_id = css.club_id or w.defender_id = css.club_id)
      )
      and not exists (
        select 1
        from public.alliance_members a1
        join public.alliance_members a2
          on a1.alliance_id = a2.alliance_id
        where a1.club_id = r_attacker.club_id
          and a2.club_id = css.club_id
      )
    order by abs(coalesce(css.elo_rating, 1000) - r_attacker.elo) asc
    limit 1;

    if r_defender.club_id is null then
      continue;
    end if;

    select t.id
    into r_territory
    from public.club_territories t
    where not exists (
      select 1
      from public.club_wars w
      where w.status = 'active'
        and w.territory_id = t.id
    )
    order by coalesce(t.strategic_value, 0) desc, t.created_at asc
    limit 1;

    if r_territory.id is null then
      continue;
    end if;

    insert into public.club_wars (
      challenger_id,
      defender_id,
      territory_id,
      season_id,
      status,
      challenger_xp,
      defender_xp,
      challenger_predictions,
      defender_predictions,
      challenger_wins,
      defender_wins,
      xp_reward,
      created_at,
      updated_at
    )
    values (
      r_attacker.club_id,
      r_defender.club_id,
      r_territory.id,
      v_season_id,
      'active',
      0,
      0,
      0,
      0,
      0,
      0,
      250,
      now(),
      now()
    );

    v_created_count := v_created_count + 1;
  end loop;

  return v_created_count;
end;
$$;


ALTER FUNCTION public.smart_matchmake_ranked_wars() OWNER TO postgres;

--
-- Name: smart_matchmake_wars(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.smart_matchmake_wars() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_season_id uuid;
  v_created_count integer := 0;
  r_attacker record;
  r_defender record;
  r_territory record;
begin
  select id
  into v_season_id
  from public.seasons
  where is_active = true
  limit 1;

  if v_season_id is null then
    raise exception 'No active season';
  end if;

  for r_attacker in
    select c.id
    from public.clubs c
    where not exists (
      select 1
      from public.club_wars w
      where w.status = 'active'
        and (w.challenger_id = c.id or w.defender_id = c.id)
    )
  loop
    select c.id
    into r_defender
    from public.clubs c
    left join public.club_season_stats css
      on css.club_id = c.id
     and css.season_id = v_season_id
    where c.id <> r_attacker.id
      and not exists (
        select 1
        from public.club_wars w
        where w.status = 'active'
          and (w.challenger_id = c.id or w.defender_id = c.id)
      )
      and not exists (
        select 1
        from public.alliance_members a1
        join public.alliance_members a2
          on a1.alliance_id = a2.alliance_id
        where a1.club_id = r_attacker.id
          and a2.club_id = c.id
      )
    order by coalesce(css.elo_rating, 1000) asc
    limit 1;

    if r_defender.id is null then
      continue;
    end if;

    select t.id
    into r_territory
    from public.club_territories t
    where not exists (
      select 1
      from public.club_wars w
      where w.status = 'active'
        and w.territory_id = t.id
    )
    order by coalesce(t.strategic_value, 0) desc, t.created_at asc
    limit 1;

    if r_territory.id is null then
      continue;
    end if;

    insert into public.club_wars (
      challenger_id,
      defender_id,
      territory_id,
      season_id,
      status,
      challenger_xp,
      defender_xp,
      challenger_predictions,
      defender_predictions,
      challenger_wins,
      defender_wins,
      xp_reward,
      created_at,
      updated_at
    )
    values (
      r_attacker.id,
      r_defender.id,
      r_territory.id,
      v_season_id,
      'active',
      0,
      0,
      0,
      0,
      0,
      0,
      200,
      now(),
      now()
    );

    v_created_count := v_created_count + 1;
  end loop;

  return v_created_count;
end;
$$;


ALTER FUNCTION public.smart_matchmake_wars() OWNER TO postgres;

--
-- Name: spend_arena_balance(integer, text, uuid, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Récupérer l'ID utilisateur authentifié
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not authenticated'
    );
  END IF;

  -- Validation du montant
  IF p_amount <= 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid amount (must be positive)'
    );
  END IF;

  -- Validation du type de transaction
  IF p_transaction_type NOT IN ('spend_prize', 'spend_staking') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid transaction type for spending'
    );
  END IF;

  -- Récupérer le solde actuel (avec verrou)
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile not found'
    );
  END IF;

  -- Vérifier que le solde est suffisant
  IF v_current_balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;

  -- Calculer nouveau solde
  v_new_balance := v_current_balance - p_amount;

  -- Mettre à jour le profil
  UPDATE profiles
  SET 
    arena_balance = v_new_balance,
    updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Créer l'entrée d'audit
  INSERT INTO arena_transactions (
    user_id,
    transaction_type,
    amount,
    balance_before,
    balance_after,
    reference_id,
    metadata,
    ip_address,
    user_agent
  ) VALUES (
    v_user_id,
    p_transaction_type,
    -p_amount, -- Négatif pour dépense
    v_current_balance,
    v_new_balance,
    p_reference_id,
    p_metadata,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  )
  RETURNING id INTO v_transaction_id;

  -- Retourner le succès
  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'transaction_id', v_transaction_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;


ALTER FUNCTION public.spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) OWNER TO postgres;

--
-- Name: spend_arena_secure(bigint, public.arena_source, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text DEFAULT NULL::text, p_reference_id text DEFAULT NULL::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_current_balance BIGINT;
  v_new_balance BIGINT;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Invalid amount');
  END IF;

  -- Récupérer balance avec verrou
  SELECT arena_balance INTO v_current_balance
  FROM profiles
  WHERE user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Vérifier solde suffisant
  IF v_current_balance < p_amount THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance',
      'current_balance', v_current_balance,
      'required', p_amount
    );
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Mettre à jour
  UPDATE profiles
  SET arena_balance = v_new_balance, updated_at = NOW()
  WHERE user_id = v_user_id;

  -- Logger (montant négatif pour dépense)
  INSERT INTO arena_ledger (user_id, amount, source, description, reference_id)
  VALUES (v_user_id, -p_amount, p_source, p_description, p_reference_id);

  RETURN json_build_object(
    'success', true,
    'new_balance', v_new_balance,
    'amount_spent', p_amount
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;


ALTER FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) OWNER TO postgres;

--
-- Name: FUNCTION spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) IS 'Dépenser de l''ARENA avec vérification du solde';


--
-- Name: start_club_challenge(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_club_challenge(p_club_id uuid, p_template_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_end_date timestamp;
begin
  select now() + (duration_days || ' days')::interval
  into v_end_date
  from club_challenge_templates
  where id = p_template_id;

  insert into club_challenges (
    club_id,
    template_id,
    target_value,
    end_date,
    status
  )
  select
    p_club_id,
    id,
    target_value,
    v_end_date,
    'active'
  from club_challenge_templates
  where id = p_template_id;

  return json_build_object('success', true);
end;
$$;


ALTER FUNCTION public.start_club_challenge(p_club_id uuid, p_template_id uuid) OWNER TO postgres;

--
-- Name: start_club_season(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_club_season(p_name text, p_duration_days integer DEFAULT 30) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_season_id uuid;
begin
  update club_seasons
  set status = 'finished',
      updated_at = now()
  where status = 'active';

  insert into club_seasons (
    name,
    status,
    start_date,
    end_date
  )
  values (
    p_name,
    'active',
    now(),
    now() + (p_duration_days || ' days')::interval
  )
  returning id into v_season_id;

  insert into club_season_rankings (
    season_id,
    club_id,
    total_xp,
    total_predictions,
    total_wins
  )
  select
    v_season_id,
    c.id,
    c.total_xp,
    c.total_predictions,
    c.total_wins
  from clubs c;

  return json_build_object(
    'success', true,
    'season_id', v_season_id
  );
end;
$$;


ALTER FUNCTION public.start_club_season(p_name text, p_duration_days integer) OWNER TO postgres;

--
-- Name: start_club_war(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_club_war(p_club_id uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$

declare
v_opponent uuid;
v_war_id uuid;

begin

v_opponent := find_war_opponent(p_club_id);

if v_opponent is null then
return json_build_object(
  'success', false,
  'error', 'No opponent available'
);
end if;

insert into club_wars(
challenger_id,
defender_id,
status
)

values(
p_club_id,
v_opponent,
'active'
)

returning id into v_war_id;

return json_build_object(
'success', true,
'war_id', v_war_id
);

end;

$$;


ALTER FUNCTION public.start_club_war(p_club_id uuid) OWNER TO postgres;

--
-- Name: start_new_season(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_new_season(p_name text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_new_season_id uuid;
begin
  update public.seasons
  set is_active = false,
      status = case when status = 'active' then 'finished' else status end;

  insert into public.seasons (
    name,
    start_date,
    end_date,
    is_active,
    status
  )
  values (
    p_name,
    now(),
    now() + interval '30 days',
    true,
    'active'
  )
  returning id into v_new_season_id;

  update public.club_wars
  set status = 'finished',
      updated_at = now()
  where status = 'active';

  return v_new_season_id;
end;
$$;


ALTER FUNCTION public.start_new_season(p_name text) OWNER TO postgres;

--
-- Name: start_new_season(text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_new_season(p_name text, p_duration_days integer DEFAULT 60) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_existing RECORD;
  v_new_season uuid;
BEGIN

  -- Vérifier qu'il n'y a pas déjà une saison active
  SELECT * INTO v_existing
  FROM seasons
  WHERE is_active = true
  LIMIT 1;

  IF v_existing IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'A season is already active'
    );
  END IF;

  -- Créer nouvelle saison
  INSERT INTO seasons (name, start_date, end_date, is_active)
  VALUES (
    p_name,
    now(),
    now() + (p_duration_days || ' days')::interval,
    true
  )
  RETURNING id INTO v_new_season;

  RETURN json_build_object(
    'success', true,
    'season_id', v_new_season,
    'season_name', p_name
  );

END;
$$;


ALTER FUNCTION public.start_new_season(p_name text, p_duration_days integer) OWNER TO postgres;

--
-- Name: start_territory_war(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_territory_war(p_attacker_club uuid, p_territory uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
    v_defender uuid;
    v_season uuid;
    v_war_id uuid;
begin

    select controlling_club_id
    into v_defender
    from club_territories
    where id = p_territory;

    if v_defender is null then
        return json_build_object(
            'success', false,
            'error', 'Territory has no owner'
        );
    end if;

    if v_defender = p_attacker_club then
        return json_build_object(
            'success', false,
            'error', 'You already control this territory'
        );
    end if;

    select id
    into v_season
    from seasons
    where is_active = true
    limit 1;

    insert into club_wars(
        challenger_id,
        defender_id,
        territory_id,
        season_id,
        status
    )
    values(
        p_attacker_club,
        v_defender,
        p_territory,
        v_season,
        'active'
    )
    returning id into v_war_id;

    return json_build_object(
        'success', true,
        'war_id', v_war_id
    );

end;
$$;


ALTER FUNCTION public.start_territory_war(p_attacker_club uuid, p_territory uuid) OWNER TO postgres;

--
-- Name: start_war_from_unit_arrival(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_war_from_unit_arrival(p_movement_id uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_unit_id uuid;
  v_to_territory_id uuid;
  v_from_territory_id uuid;
  v_unit_club_id uuid;
  v_defender_club_id uuid;
  v_existing_war_id uuid;
  v_active_season_id uuid;
  v_new_war_id uuid;
begin
  select
    um.unit_id,
    um.to_territory_id,
    um.from_territory_id,
    cu.club_id
  into
    v_unit_id,
    v_to_territory_id,
    v_from_territory_id,
    v_unit_club_id
  from public.unit_movements um
  join public.club_units cu
    on cu.id = um.unit_id
  where um.id = p_movement_id;

  select controlling_club_id
  into v_defender_club_id
  from public.club_territories
  where id = v_to_territory_id;

  if v_unit_club_id is null or v_to_territory_id is null then
    return null;
  end if;

  if v_defender_club_id is null or v_defender_club_id = v_unit_club_id then
    return null;
  end if;

  if exists (
    select 1
    from public.alliance_members a1
    join public.alliance_members a2
      on a1.alliance_id = a2.alliance_id
    where a1.club_id = v_unit_club_id
      and a2.club_id = v_defender_club_id
  ) then
    return null;
  end if;

  select id
  into v_existing_war_id
  from public.club_wars
  where territory_id = v_to_territory_id
    and status = 'active'
  limit 1;

  if v_existing_war_id is not null then
    return v_existing_war_id;
  end if;

  select id
  into v_active_season_id
  from public.seasons
  where is_active = true
  limit 1;

  insert into public.club_wars (
    challenger_id,
    defender_id,
    territory_id,
    season_id,
    status,
    challenger_xp,
    defender_xp,
    challenger_predictions,
    defender_predictions,
    challenger_wins,
    defender_wins,
    xp_reward,
    created_at,
    updated_at
  )
  values (
    v_unit_club_id,
    v_defender_club_id,
    v_to_territory_id,
    v_active_season_id,
    'active',
    0,
    0,
    0,
    0,
    0,
    0,
    200,
    now(),
    now()
  )
  returning id into v_new_war_id;

  return v_new_war_id;
end;
$$;


ALTER FUNCTION public.start_war_from_unit_arrival(p_movement_id uuid) OWNER TO postgres;

--
-- Name: sync_balance_from_ledger(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sync_balance_from_ledger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE profiles
  SET arena_balance = (
    SELECT COALESCE(SUM(amount), 0)
    FROM arena_ledger
    WHERE user_id = NEW.user_id
  )
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.sync_balance_from_ledger() OWNER TO postgres;

--
-- Name: trigger_check_and_resolve(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_check_and_resolve() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  perform public.check_and_resolve_war(NEW.war_id);
  return NEW;
end;
$$;


ALTER FUNCTION public.trigger_check_and_resolve() OWNER TO postgres;

--
-- Name: trigger_check_and_resolve_war(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_check_and_resolve_war() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  perform public.check_and_resolve_war(new.war_id);
  return new;
end;
$$;


ALTER FUNCTION public.trigger_check_and_resolve_war() OWNER TO postgres;

--
-- Name: update_club_elo(uuid, uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  v_elo_a integer;
  v_elo_b integer;
  v_expected_a numeric;
  v_expected_b numeric;
  v_score_a numeric;
  v_score_b numeric;
  v_k integer := 40;
begin

  select elo_rating into v_elo_a
  from club_season_stats
  where season_id = p_season_id and club_id = p_club_a;

  select elo_rating into v_elo_b
  from club_season_stats
  where season_id = p_season_id and club_id = p_club_b;

  if v_elo_a is null or v_elo_b is null then
    return;
  end if;

  v_expected_a := 1 / (1 + power(10, (v_elo_b - v_elo_a) / 400.0));
  v_expected_b := 1 / (1 + power(10, (v_elo_a - v_elo_b) / 400.0));

  if p_winner = p_club_a then
    v_score_a := 1;
    v_score_b := 0;
  elsif p_winner = p_club_b then
    v_score_a := 0;
    v_score_b := 1;
  else
    v_score_a := 0.5;
    v_score_b := 0.5;
  end if;

  update club_season_stats
  set elo_rating = round(v_elo_a + v_k * (v_score_a - v_expected_a))
  where season_id = p_season_id and club_id = p_club_a;

  update club_season_stats
  set elo_rating = round(v_elo_b + v_k * (v_score_b - v_expected_b))
  where season_id = p_season_id and club_id = p_club_b;

end;
$$;


ALTER FUNCTION public.update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid) OWNER TO postgres;

--
-- Name: update_club_rivalry(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$

declare
r record;

begin

select *
into r
from club_rivalries
where
(club_a = p_club_a and club_b = p_club_b)
or
(club_a = p_club_b and club_b = p_club_a)
limit 1;

if r is null then

insert into club_rivalries (
club_a,
club_b,
wars_played
)

values (
p_club_a,
p_club_b,
1
);

else

update club_rivalries
set
wars_played = wars_played + 1,

wins_a = case
when p_winner = club_a then wins_a + 1
else wins_a
end,

wins_b = case
when p_winner = club_b then wins_b + 1
else wins_b
end,

rivalry_level = rivalry_level + 1,

updated_at = now()

where id = r.id;

end if;

end;

$$;


ALTER FUNCTION public.update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid) OWNER TO postgres;

--
-- Name: update_club_war_xp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_club_war_xp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin

-- update challenger XP
update club_wars
set challenger_xp = challenger_xp + new.xp_contributed
where challenger_id = new.club_id
and status = 'active';

-- update defender XP
update club_wars
set defender_xp = defender_xp + new.xp_contributed
where defender_id = new.club_id
and status = 'active';

return new;

end;
$$;


ALTER FUNCTION public.update_club_war_xp() OWNER TO postgres;

--
-- Name: use_referral_code(text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.use_referral_code(p_code text, p_user uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
declare
  v_referrer uuid;
begin

select user_id
into v_referrer
from referral_codes
where code = p_code;

if v_referrer is null then
 return json_build_object(
  'success', false,
  'error', 'Invalid referral code'
 );
end if;

insert into referrals(
 referrer_id,
 referred_user_id
)
values(
 v_referrer,
 p_user
);

update referral_codes
set uses = uses + 1
where code = p_code;

update season_xp
set xp = xp + 100
where user_id = v_referrer;

return json_build_object(
 'success', true
);

end;
$$;


ALTER FUNCTION public.use_referral_code(p_code text, p_user uuid) OWNER TO postgres;

--
-- Name: xp_for_level(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.xp_for_level(level_num integer) RETURNS integer
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$   SELECT FLOOR(100 * POWER(1.5, level_num - 1))::integer;
 $$;


ALTER FUNCTION public.xp_for_level(level_num integer) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


ALTER FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) OWNER TO supabase_storage_admin;

--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


ALTER FUNCTION storage.get_level(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


ALTER FUNCTION storage.get_prefix(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


ALTER FUNCTION storage.get_prefixes(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- Name: active_club_wars; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_club_wars AS
 SELECT id,
    challenger_id,
    defender_id,
    winner_id,
    status,
    start_date,
    end_date,
    challenger_xp,
    defender_xp,
    challenger_predictions,
    defender_predictions,
    challenger_wins,
    defender_wins,
    xp_reward,
    created_at,
    updated_at
   FROM public.club_wars
  WHERE (status = 'active'::text);


ALTER VIEW public.active_club_wars OWNER TO postgres;

--
-- Name: clubs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clubs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    logo_url text,
    banner_url text,
    is_public boolean DEFAULT true NOT NULL,
    member_count integer DEFAULT 1 NOT NULL,
    max_members integer DEFAULT 50 NOT NULL,
    total_xp bigint DEFAULT 0 NOT NULL,
    total_predictions integer DEFAULT 0 NOT NULL,
    total_wins integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    discord_server_id text,
    discord_server_name text,
    discord_server_icon text,
    color text DEFAULT '#00d9ff'::text,
    gold integer DEFAULT 0,
    energy integer DEFAULT 0
);


ALTER TABLE public.clubs OWNER TO postgres;

--
-- Name: guild_tournament_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guild_tournament_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tournament_id uuid NOT NULL,
    club_id uuid NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    wins integer DEFAULT 0 NOT NULL,
    losses integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.guild_tournament_entries OWNER TO postgres;

--
-- Name: guild_tournaments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guild_tournaments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'upcoming'::text NOT NULL,
    season_id uuid,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.guild_tournaments OWNER TO postgres;

--
-- Name: active_guild_tournament_board; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_guild_tournament_board AS
 SELECT gt.id AS tournament_id,
    gt.name AS tournament_name,
    gt.status,
    gte.club_id,
    c.name AS club_name,
    c.logo_url,
    gte.points,
    gte.wins,
    gte.losses,
    rank() OVER (PARTITION BY gt.id ORDER BY gte.points DESC, gte.wins DESC, gte.losses) AS rank
   FROM ((public.guild_tournaments gt
     JOIN public.guild_tournament_entries gte ON ((gte.tournament_id = gt.id)))
     JOIN public.clubs c ON ((c.id = gte.club_id)))
  WHERE (gt.status = ANY (ARRAY['active'::text, 'upcoming'::text]));


ALTER VIEW public.active_guild_tournament_board OWNER TO postgres;

--
-- Name: club_season_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_season_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid,
    club_id uuid,
    war_wins integer DEFAULT 0,
    war_losses integer DEFAULT 0,
    war_draws integer DEFAULT 0,
    war_xp integer DEFAULT 0,
    tier text DEFAULT 'bronze'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    season_score integer DEFAULT 0,
    elo_rating integer DEFAULT 1000
);


ALTER TABLE public.club_season_stats OWNER TO postgres;

--
-- Name: seasons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'active'::text
);


ALTER TABLE public.seasons OWNER TO postgres;

--
-- Name: active_season_club_leaderboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_season_club_leaderboard AS
 SELECT s.id AS season_id,
    s.name AS season_name,
    css.club_id,
    c.name AS club_name,
    c.logo_url,
    COALESCE(css.war_xp, 0) AS total_xp,
    COALESCE(css.war_wins, 0) AS war_wins,
    COALESCE(css.war_losses, 0) AS war_losses,
    COALESCE(css.elo_rating, 0) AS elo_rating,
    rank() OVER (PARTITION BY s.id ORDER BY COALESCE(css.war_xp, 0) DESC, COALESCE(css.elo_rating, 0) DESC) AS rank
   FROM ((public.seasons s
     JOIN public.club_season_stats css ON ((css.season_id = s.id)))
     JOIN public.clubs c ON ((c.id = css.club_id)))
  WHERE (s.is_active = true);


ALTER VIEW public.active_season_club_leaderboard OWNER TO postgres;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    discord_id text,
    username text,
    display_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: war_contributions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.war_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    war_id uuid NOT NULL,
    user_id uuid NOT NULL,
    club_id uuid NOT NULL,
    xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.war_contributions OWNER TO postgres;

--
-- Name: active_season_player_leaderboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_season_player_leaderboard AS
 WITH active_season AS (
         SELECT seasons.id
           FROM public.seasons
          WHERE (seasons.is_active = true)
         LIMIT 1
        )
 SELECT a.id AS season_id,
    wc.user_id,
    COALESCE(p.display_name, p.username, 'Anonymous'::text) AS username,
    p.avatar_url,
    sum(wc.xp) AS total_xp,
    count(*) AS contributions,
    rank() OVER (PARTITION BY a.id ORDER BY (sum(wc.xp)) DESC) AS rank
   FROM (((active_season a
     JOIN public.club_wars w ON ((w.season_id = a.id)))
     JOIN public.war_contributions wc ON ((wc.war_id = w.id)))
     LEFT JOIN public.profiles p ON ((p.id = wc.user_id)))
  GROUP BY a.id, wc.user_id, p.display_name, p.username, p.avatar_url;


ALTER VIEW public.active_season_player_leaderboard OWNER TO postgres;

--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id uuid NOT NULL,
    action_type text NOT NULL,
    target_type text NOT NULL,
    target_id text,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.admin_audit_logs OWNER TO postgres;

--
-- Name: alliance_invites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alliance_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    alliance_id uuid NOT NULL,
    club_id uuid NOT NULL,
    invited_by_club_id uuid NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    responded_at timestamp with time zone
);


ALTER TABLE public.alliance_invites OWNER TO postgres;

--
-- Name: alliance_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alliance_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    alliance_id uuid NOT NULL,
    club_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.alliance_members OWNER TO postgres;

--
-- Name: alliance_member_details; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.alliance_member_details AS
 SELECT am.id,
    am.alliance_id,
    am.club_id,
    am.role,
    am.joined_at,
    c.name AS club_name,
    c.logo_url
   FROM (public.alliance_members am
     JOIN public.clubs c ON ((c.id = am.club_id)));


ALTER VIEW public.alliance_member_details OWNER TO postgres;

--
-- Name: alliances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alliances (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    owner_club_id uuid NOT NULL,
    season_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.alliances OWNER TO postgres;

--
-- Name: alliance_overview; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.alliance_overview AS
 SELECT a.id,
    a.name,
    a.description,
    a.owner_club_id,
    a.season_id,
    a.created_at,
    a.updated_at,
    c.name AS owner_club_name,
    count(DISTINCT am.club_id) AS members_count
   FROM ((public.alliances a
     LEFT JOIN public.clubs c ON ((c.id = a.owner_club_id)))
     LEFT JOIN public.alliance_members am ON ((am.alliance_id = a.id)))
  GROUP BY a.id, a.name, a.description, a.owner_club_id, a.season_id, a.created_at, a.updated_at, c.name;


ALTER VIEW public.alliance_overview OWNER TO postgres;

--
-- Name: arena_ledger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arena_ledger (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    amount bigint NOT NULL,
    source public.arena_source NOT NULL,
    description text,
    reference_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.arena_ledger OWNER TO postgres;

--
-- Name: arena_ledger_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.arena_ledger ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.arena_ledger_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: arena_prizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arena_prizes (
    id integer NOT NULL,
    sku character varying NOT NULL,
    name text NOT NULL,
    description text,
    image_url text,
    category character varying,
    price_arena integer NOT NULL,
    usd_value numeric,
    stock integer DEFAULT '-1'::integer,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.arena_prizes OWNER TO postgres;

--
-- Name: arena_prizes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.arena_prizes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.arena_prizes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: arena_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arena_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    transaction_type text NOT NULL,
    amount integer NOT NULL,
    balance_before integer NOT NULL,
    balance_after integer NOT NULL,
    reference_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    ip_address inet,
    user_agent text,
    CONSTRAINT arena_transactions_transaction_type_check CHECK ((transaction_type = ANY (ARRAY['earn_prediction'::text, 'earn_streak'::text, 'earn_challenge'::text, 'spend_prize'::text, 'spend_staking'::text, 'refund'::text, 'admin_adjustment'::text])))
);


ALTER TABLE public.arena_transactions OWNER TO postgres;

--
-- Name: army_group_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.army_group_units (
    group_id uuid NOT NULL,
    unit_id uuid NOT NULL
);


ALTER TABLE public.army_group_units OWNER TO postgres;

--
-- Name: army_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.army_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid,
    name text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.army_groups OWNER TO postgres;

--
-- Name: club_territories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_territories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    region text,
    controlling_club_id uuid,
    xp_bonus integer DEFAULT 0 NOT NULL,
    arena_bonus integer DEFAULT 0 NOT NULL,
    prestige_bonus integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    map_key text,
    x integer,
    y integer,
    is_capital boolean DEFAULT false,
    map_x integer,
    map_y integer,
    capture_progress integer DEFAULT 0,
    continent text,
    strategic_value integer DEFAULT 1,
    siege_progress integer DEFAULT 0,
    bonus_type text,
    bonus_value integer DEFAULT 0,
    longitude double precision,
    latitude double precision,
    gold_income integer DEFAULT 100,
    energy_income integer DEFAULT 10,
    upkeep_cost integer DEFAULT 25,
    lat double precision,
    lng double precision,
    influence_value integer DEFAULT 0,
    frontline_score integer DEFAULT 0,
    terrain_type text DEFAULT 'plains'::text,
    move_cost integer DEFAULT 1
);


ALTER TABLE public.club_territories OWNER TO postgres;

--
-- Name: club_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_units (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    territory_id uuid NOT NULL,
    unit_type text DEFAULT 'infantry'::text NOT NULL,
    power integer DEFAULT 10 NOT NULL,
    speed integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'idle'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    vision_radius integer DEFAULT 1,
    hp integer DEFAULT 100,
    crit_chance integer DEFAULT 10,
    skill_type text DEFAULT 'none'::text,
    max_hp integer DEFAULT 100,
    dps integer DEFAULT 10
);


ALTER TABLE public.club_units OWNER TO postgres;

--
-- Name: army_stacks_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.army_stacks_live AS
 SELECT cu.club_id,
    c.name AS club_name,
    COALESCE(c.color, '#00d9ff'::text) AS club_color,
    cu.territory_id,
    ct.name AS territory_name,
    ct.lat,
    ct.lng,
    (count(*))::integer AS unit_count,
    (COALESCE(sum(cu.power), (0)::bigint))::integer AS total_power
   FROM ((public.club_units cu
     JOIN public.club_territories ct ON ((ct.id = cu.territory_id)))
     LEFT JOIN public.clubs c ON ((c.id = cu.club_id)))
  GROUP BY cu.club_id, c.name, c.color, cu.territory_id, ct.name, ct.lat, ct.lng;


ALTER VIEW public.army_stacks_live OWNER TO postgres;

--
-- Name: army_units_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.army_units_live AS
 SELECT cu.id AS unit_id,
    cu.club_id,
    c.name AS club_name,
    COALESCE(c.color, '#00d9ff'::text) AS club_color,
    cu.territory_id,
    ct.name AS territory_name,
    ct.lat,
    ct.lng,
    cu.unit_type,
    cu.power,
    cu.speed,
    cu.status,
    cu.created_at,
    cu.updated_at
   FROM ((public.club_units cu
     JOIN public.club_territories ct ON ((ct.id = cu.territory_id)))
     LEFT JOIN public.clubs c ON ((c.id = cu.club_id)));


ALTER VIEW public.army_units_live OWNER TO postgres;

--
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text NOT NULL,
    category public.badge_category NOT NULL,
    rarity public.badge_rarity DEFAULT 'common'::public.badge_rarity NOT NULL,
    requirement_type text NOT NULL,
    requirement_value integer DEFAULT 1 NOT NULL,
    arena_points_reward integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: battle_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.battle_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    territory_id uuid NOT NULL,
    round integer DEFAULT 1 NOT NULL,
    payload jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.battle_logs OWNER TO postgres;

--
-- Name: boss_damage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boss_damage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    boss_id uuid,
    club_id uuid,
    damage integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.boss_damage OWNER TO postgres;

--
-- Name: club_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid,
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    xp_amount integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_activities OWNER TO postgres;

--
-- Name: club_ban_appeals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_ban_appeals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    admin_response text,
    responded_by uuid,
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_ban_appeals OWNER TO postgres;

--
-- Name: club_banned_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_banned_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    banned_by uuid NOT NULL,
    reason text,
    banned_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_banned_members OWNER TO postgres;

--
-- Name: club_challenge_contributions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_challenge_contributions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    challenge_id uuid NOT NULL,
    user_id uuid NOT NULL,
    contribution_value integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_challenge_contributions OWNER TO postgres;

--
-- Name: club_challenge_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_challenge_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    challenge_type text NOT NULL,
    target_value integer NOT NULL,
    duration_days integer DEFAULT 7 NOT NULL,
    xp_reward integer DEFAULT 100 NOT NULL,
    arena_points_reward integer DEFAULT 50 NOT NULL,
    icon text DEFAULT 'target'::text NOT NULL,
    difficulty text DEFAULT 'normal'::text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_challenge_templates OWNER TO postgres;

--
-- Name: club_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    template_id uuid NOT NULL,
    target_value integer NOT NULL,
    current_value integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    rewards_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_challenges OWNER TO postgres;

--
-- Name: club_domination_map; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_domination_map AS
 SELECT t.id AS territory_id,
    t.name AS territory_name,
    t.controlling_club_id AS club_id,
    c.name AS club_name,
    c.logo_url,
        CASE
            WHEN (t.controlling_club_id IS NULL) THEN 'neutral'::text
            ELSE 'controlled'::text
        END AS status
   FROM (public.club_territories t
     LEFT JOIN public.clubs c ON ((c.id = t.controlling_club_id)));


ALTER VIEW public.club_domination_map OWNER TO postgres;

--
-- Name: club_join_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_join_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_join_requests OWNER TO postgres;

--
-- Name: club_leaderboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_leaderboard AS
 SELECT id,
    name,
    slug,
    total_xp,
    total_predictions,
    total_wins,
        CASE
            WHEN (total_predictions > 0) THEN round((((total_wins)::numeric / (total_predictions)::numeric) * (100)::numeric))
            ELSE (0)::numeric
        END AS accuracy
   FROM public.clubs
  ORDER BY total_xp DESC;


ALTER VIEW public.club_leaderboard OWNER TO postgres;

--
-- Name: club_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'member'::text NOT NULL,
    xp_contributed bigint DEFAULT 0 NOT NULL,
    predictions_count integer DEFAULT 0 NOT NULL,
    wins_count integer DEFAULT 0 NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_members OWNER TO postgres;

--
-- Name: club_message_reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_message_reactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    message_id uuid NOT NULL,
    user_id uuid NOT NULL,
    emoji text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_message_reactions OWNER TO postgres;

--
-- Name: club_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'text'::text NOT NULL,
    file_url text,
    file_name text,
    file_type text,
    reply_to_id uuid,
    is_pinned boolean DEFAULT false NOT NULL,
    pinned_by uuid,
    pinned_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_messages OWNER TO postgres;

--
-- Name: club_moderation_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_moderation_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    moderator_id uuid NOT NULL,
    action_type text NOT NULL,
    target_user_id uuid,
    target_message_id uuid,
    message_content text,
    message_author_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_moderation_logs OWNER TO postgres;

--
-- Name: club_muted_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_muted_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    user_id uuid NOT NULL,
    muted_by uuid NOT NULL,
    reason text,
    muted_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_muted_members OWNER TO postgres;

--
-- Name: club_poll_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_poll_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    poll_id uuid NOT NULL,
    option_text text NOT NULL,
    option_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_poll_options OWNER TO postgres;

--
-- Name: club_poll_votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_poll_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    poll_id uuid NOT NULL,
    option_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_poll_votes OWNER TO postgres;

--
-- Name: club_polls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_polls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    creator_id uuid NOT NULL,
    message_id uuid,
    question text NOT NULL,
    is_multiple_choice boolean DEFAULT false NOT NULL,
    is_anonymous boolean DEFAULT false NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_polls OWNER TO postgres;

--
-- Name: club_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rank_from integer NOT NULL,
    rank_to integer NOT NULL,
    xp_bonus integer DEFAULT 0 NOT NULL,
    arena_points integer DEFAULT 0 NOT NULL,
    badge_name text,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_rewards OWNER TO postgres;

--
-- Name: club_rivalries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_rivalries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_a uuid,
    club_b uuid,
    wars_played integer DEFAULT 0,
    wins_a integer DEFAULT 0,
    wins_b integer DEFAULT 0,
    rivalry_level integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.club_rivalries OWNER TO postgres;

--
-- Name: club_season_leaderboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_season_leaderboard AS
 SELECT css.season_id,
    css.club_id,
    c.name AS club_name,
    css.war_wins,
    css.war_losses,
    css.war_draws,
    css.war_xp,
    css.season_score,
    css.tier,
    rank() OVER (PARTITION BY css.season_id ORDER BY css.season_score DESC) AS rank
   FROM (public.club_season_stats css
     JOIN public.clubs c ON ((c.id = css.club_id)));


ALTER VIEW public.club_season_leaderboard OWNER TO postgres;

--
-- Name: club_season_rankings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_season_rankings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid NOT NULL,
    club_id uuid NOT NULL,
    total_xp integer DEFAULT 0 NOT NULL,
    total_predictions integer DEFAULT 0 NOT NULL,
    total_wins integer DEFAULT 0 NOT NULL,
    rank integer,
    rewards_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_season_rankings OWNER TO postgres;

--
-- Name: club_season_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_season_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rank_from integer NOT NULL,
    rank_to integer NOT NULL,
    xp_bonus integer DEFAULT 0 NOT NULL,
    arena_points integer DEFAULT 0 NOT NULL,
    badge_name text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_season_rewards OWNER TO postgres;

--
-- Name: club_seasons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT club_seasons_status_check CHECK ((status = ANY (ARRAY['active'::text, 'finished'::text, 'upcoming'::text])))
);


ALTER TABLE public.club_seasons OWNER TO postgres;

--
-- Name: club_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_stats AS
SELECT
    NULL::uuid AS id,
    NULL::text AS name,
    NULL::text AS slug,
    NULL::bigint AS total_xp,
    NULL::integer AS total_wins,
    NULL::integer AS total_predictions,
    NULL::bigint AS member_count,
    NULL::numeric AS accuracy;


ALTER VIEW public.club_stats OWNER TO postgres;

--
-- Name: club_territory_leaderboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_territory_leaderboard AS
 SELECT c.id AS club_id,
    c.name AS club_name,
    count(t.id) AS territories_count,
    COALESCE(sum(t.xp_bonus), (0)::bigint) AS total_xp_bonus,
    COALESCE(sum(t.arena_bonus), (0)::bigint) AS total_arena_bonus,
    COALESCE(sum(t.prestige_bonus), (0)::bigint) AS total_prestige_bonus
   FROM (public.clubs c
     LEFT JOIN public.club_territories t ON ((t.controlling_club_id = c.id)))
  GROUP BY c.id, c.name
  ORDER BY (count(t.id)) DESC, COALESCE(sum(t.prestige_bonus), (0)::bigint) DESC;


ALTER VIEW public.club_territory_leaderboard OWNER TO postgres;

--
-- Name: club_top_members; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_top_members AS
 SELECT club_id,
    user_id,
    xp_contributed,
    rank() OVER (PARTITION BY club_id ORDER BY xp_contributed DESC) AS rank
   FROM public.club_members;


ALTER VIEW public.club_top_members OWNER TO postgres;

--
-- Name: club_war_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_war_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    war_id uuid NOT NULL,
    club_id uuid NOT NULL,
    total_score numeric DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.club_war_scores OWNER TO postgres;

--
-- Name: club_wars_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.club_wars_live AS
 SELECT w.id AS war_id,
    w.status,
    w.created_at,
    c1.id AS challenger_id,
    c1.name AS challenger_name,
    c2.id AS defender_id,
    c2.name AS defender_name,
    w.challenger_xp,
    w.defender_xp,
        CASE
            WHEN (w.challenger_xp > w.defender_xp) THEN c1.name
            WHEN (w.defender_xp > w.challenger_xp) THEN c2.name
            ELSE 'tie'::text
        END AS leader
   FROM ((public.club_wars w
     JOIN public.clubs c1 ON ((c1.id = w.challenger_id)))
     JOIN public.clubs c2 ON ((c2.id = w.defender_id)))
  WHERE (w.status = 'active'::text);


ALTER VIEW public.club_wars_live OWNER TO postgres;

--
-- Name: club_weekly_rankings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_weekly_rankings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid NOT NULL,
    week_start date NOT NULL,
    week_end date NOT NULL,
    total_xp bigint DEFAULT 0 NOT NULL,
    total_predictions integer DEFAULT 0 NOT NULL,
    total_wins integer DEFAULT 0 NOT NULL,
    accuracy numeric DEFAULT 0 NOT NULL,
    final_rank integer,
    rewards_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_weekly_rankings OWNER TO postgres;

--
-- Name: cosmetics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text,
    type text,
    rarity text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cosmetics OWNER TO postgres;

--
-- Name: daily_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    challenge_type text NOT NULL,
    icon text DEFAULT 'target'::text NOT NULL,
    xp_reward integer DEFAULT 25 NOT NULL,
    requirement_value integer DEFAULT 1 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.daily_challenges OWNER TO postgres;

--
-- Name: fog_of_war_territories; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.fog_of_war_territories AS
 SELECT id,
    name,
    slug,
    region,
    continent,
    controlling_club_id,
    is_capital,
    map_key,
    map_x,
    map_y,
    x,
    y,
    capture_progress,
    siege_progress,
    strategic_value,
    xp_bonus,
    arena_bonus,
    prestige_bonus,
    created_at,
    updated_at,
        CASE
            WHEN (controlling_club_id IS NULL) THEN true
            ELSE false
        END AS partially_hidden
   FROM public.club_territories t;


ALTER VIEW public.fog_of_war_territories OWNER TO postgres;

--
-- Name: territory_adjacency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territory_adjacency (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    territory_id uuid NOT NULL,
    adjacent_territory_id uuid NOT NULL
);


ALTER TABLE public.territory_adjacency OWNER TO postgres;

--
-- Name: frontline_edges; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.frontline_edges AS
 SELECT t1.id AS from_territory_id,
    t1.name AS from_territory_name,
    t1.lat AS from_lat,
    t1.lng AS from_lng,
    t1.controlling_club_id AS from_club_id,
    t2.id AS to_territory_id,
    t2.name AS to_territory_name,
    t2.lat AS to_lat,
    t2.lng AS to_lng,
    t2.controlling_club_id AS to_club_id
   FROM ((public.territory_adjacency ta
     JOIN public.club_territories t1 ON ((t1.id = ta.territory_id)))
     JOIN public.club_territories t2 ON ((t2.id = ta.adjacent_territory_id)))
  WHERE ((t1.controlling_club_id IS NOT NULL) AND (t2.controlling_club_id IS NOT NULL) AND (t1.controlling_club_id <> t2.controlling_club_id));


ALTER VIEW public.frontline_edges OWNER TO postgres;

--
-- Name: frontline_territories; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.frontline_territories AS
 SELECT DISTINCT t1.id AS territory_id,
    t1.name AS territory_name,
    t1.controlling_club_id AS club_id,
    c1.name AS club_name,
    COALESCE(c1.color, '#00d9ff'::text) AS club_color,
    t1.lat,
    t1.lng,
    1 AS is_frontline
   FROM (((public.club_territories t1
     JOIN public.territory_adjacency ta ON ((ta.territory_id = t1.id)))
     JOIN public.club_territories t2 ON ((t2.id = ta.adjacent_territory_id)))
     LEFT JOIN public.clubs c1 ON ((c1.id = t1.controlling_club_id)))
  WHERE ((t1.controlling_club_id IS NOT NULL) AND (t2.controlling_club_id IS NOT NULL) AND (t1.controlling_club_id <> t2.controlling_club_id));


ALTER VIEW public.frontline_territories OWNER TO postgres;

--
-- Name: global_club_ranking; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.global_club_ranking AS
 SELECT c.id AS club_id,
    c.name AS club_name,
    c.logo_url,
    COALESCE(css.total_xp, (0)::bigint) AS total_xp,
    COALESCE(ct.territories, (0)::bigint) AS territories,
    rank() OVER (ORDER BY COALESCE(css.total_xp, (0)::bigint) DESC) AS rank
   FROM ((public.clubs c
     LEFT JOIN ( SELECT club_season_stats.club_id,
            sum(club_season_stats.war_xp) AS total_xp
           FROM public.club_season_stats
          GROUP BY club_season_stats.club_id) css ON ((css.club_id = c.id)))
     LEFT JOIN ( SELECT club_territories.controlling_club_id AS club_id,
            count(*) AS territories
           FROM public.club_territories
          WHERE (club_territories.controlling_club_id IS NOT NULL)
          GROUP BY club_territories.controlling_club_id) ct ON ((ct.club_id = c.id)));


ALTER VIEW public.global_club_ranking OWNER TO postgres;

--
-- Name: global_player_ranking; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.global_player_ranking AS
 SELECT wc.user_id,
    COALESCE(p.display_name, p.username, 'Anonymous'::text) AS username,
    p.avatar_url,
    sum(wc.xp) AS total_xp,
    count(*) AS contributions,
    rank() OVER (ORDER BY (sum(wc.xp)) DESC) AS rank
   FROM (public.war_contributions wc
     LEFT JOIN public.profiles p ON ((p.id = wc.user_id)))
  GROUP BY wc.user_id, p.display_name, p.username, p.avatar_url;


ALTER VIEW public.global_player_ranking OWNER TO postgres;

--
-- Name: season_hall_of_fame; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.season_hall_of_fame (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid NOT NULL,
    season_name text NOT NULL,
    user_id uuid NOT NULL,
    username text,
    rank integer NOT NULL,
    xp integer NOT NULL,
    reward integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.season_hall_of_fame OWNER TO postgres;

--
-- Name: hall_of_fame_public; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.hall_of_fame_public AS
 SELECT season_name,
    rank,
    username,
    xp,
    reward,
    created_at
   FROM public.season_hall_of_fame
  ORDER BY created_at DESC, rank;


ALTER VIEW public.hall_of_fame_public OWNER TO postgres;

--
-- Name: leaderboard_global; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.leaderboard_global AS
 SELECT wc.user_id,
    p.username,
    COALESCE(sum(wc.xp), (0)::bigint) AS total_xp,
    count(*) AS contributions
   FROM (public.war_contributions wc
     LEFT JOIN public.profiles p ON ((p.id = wc.user_id)))
  GROUP BY wc.user_id, p.username
  ORDER BY COALESCE(sum(wc.xp), (0)::bigint) DESC;


ALTER VIEW public.leaderboard_global OWNER TO postgres;

--
-- Name: leaderboard_war; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.leaderboard_war AS
 SELECT wc.war_id,
    wc.user_id,
    p.username,
    sum(wc.xp) AS total_xp,
    count(*) AS contributions
   FROM (public.war_contributions wc
     LEFT JOIN public.profiles p ON ((p.id = wc.user_id)))
  GROUP BY wc.war_id, wc.user_id, p.username;


ALTER VIEW public.leaderboard_war OWNER TO postgres;

--
-- Name: level_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.level_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level_required integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    reward_type text NOT NULL,
    reward_value text NOT NULL,
    icon text DEFAULT 'gift'::text NOT NULL,
    rarity text DEFAULT 'common'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.level_rewards OWNER TO postgres;

--
-- Name: live_club_war; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.live_club_war AS
 SELECT w.id,
    c1.name AS challenger_name,
    c2.name AS defender_name,
    w.challenger_id,
    w.defender_id,
    w.challenger_xp,
    w.defender_xp,
    w.challenger_predictions,
    w.defender_predictions,
    w.challenger_wins,
    w.defender_wins,
    w.status,
    w.start_date
   FROM ((public.club_wars w
     JOIN public.clubs c1 ON ((c1.id = w.challenger_id)))
     JOIN public.clubs c2 ON ((c2.id = w.defender_id)))
  WHERE (w.status = 'active'::text);


ALTER VIEW public.live_club_war OWNER TO postgres;

--
-- Name: matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_id text,
    team_a text,
    team_b text,
    winner text,
    resolved boolean DEFAULT false,
    resolved_at timestamp with time zone,
    resolved_by uuid
);


ALTER TABLE public.matches OWNER TO postgres;

--
-- Name: player_cosmetics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_cosmetics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    cosmetic_id uuid,
    equipped boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.player_cosmetics OWNER TO postgres;

--
-- Name: player_prestige; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_prestige (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    level integer DEFAULT 1,
    prestige integer DEFAULT 0,
    xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.player_prestige OWNER TO postgres;

--
-- Name: predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    match_id text NOT NULL,
    selected_team text NOT NULL,
    odds numeric NOT NULL,
    stake_amount integer NOT NULL,
    potential_winnings integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    xp_awarded boolean DEFAULT false,
    CONSTRAINT stake_limit_check CHECK ((stake_amount <= 1000))
);


ALTER TABLE public.predictions OWNER TO postgres;

--
-- Name: prize_redemptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prize_redemptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    prize_id integer NOT NULL,
    prize_name text NOT NULL,
    price_paid integer NOT NULL,
    delivery_info jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.prize_redemptions OWNER TO postgres;

--
-- Name: ranked_club_board; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ranked_club_board AS
 SELECT css.club_id,
    c.name AS club_name,
    c.logo_url,
    COALESCE(c.color, '#00d9ff'::text) AS club_color,
    css.elo_rating,
    css.war_wins,
    css.war_losses,
    rank() OVER (ORDER BY COALESCE(css.elo_rating, 1000) DESC) AS rank
   FROM ((public.club_season_stats css
     JOIN public.clubs c ON ((c.id = css.club_id)))
     JOIN public.seasons s ON ((s.id = css.season_id)))
  WHERE (s.is_active = true);


ALTER VIEW public.ranked_club_board OWNER TO postgres;

--
-- Name: ranked_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ranked_matches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid,
    club_a_id uuid NOT NULL,
    club_b_id uuid NOT NULL,
    winner_club_id uuid,
    loser_club_id uuid,
    elo_delta integer DEFAULT 0,
    status text DEFAULT 'finished'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ranked_matches OWNER TO postgres;

--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    action_type text NOT NULL,
    action_count integer DEFAULT 1,
    window_start timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rate_limits OWNER TO postgres;

--
-- Name: referral_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    code text,
    uses integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.referral_codes OWNER TO postgres;

--
-- Name: referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referrals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    referrer_id uuid,
    referred_user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.referrals OWNER TO postgres;

--
-- Name: season_club_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.season_club_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid,
    club_id uuid,
    territories integer DEFAULT 0,
    war_wins integer DEFAULT 0,
    xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.season_club_scores OWNER TO postgres;

--
-- Name: season_xp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.season_xp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid,
    user_id uuid,
    xp integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    level integer DEFAULT 1
);


ALTER TABLE public.season_xp OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    stripe_customer_id text,
    stripe_subscription_id text,
    status text,
    updated_at timestamp without time zone DEFAULT now(),
    stripe_price_id text,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: support_inquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_inquiries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name text NOT NULL,
    email text NOT NULL,
    subject text NOT NULL,
    message text NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_inquiries OWNER TO postgres;

--
-- Name: territory_adjacency_debug; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.territory_adjacency_debug AS
 SELECT ta.territory_id,
    t1.name AS territory_name,
    ta.adjacent_territory_id,
    t2.name AS adjacent_territory_name
   FROM ((public.territory_adjacency ta
     JOIN public.club_territories t1 ON ((t1.id = ta.territory_id)))
     JOIN public.club_territories t2 ON ((t2.id = ta.adjacent_territory_id)));


ALTER VIEW public.territory_adjacency_debug OWNER TO postgres;

--
-- Name: territory_connections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territory_connections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    territory_a uuid,
    territory_b uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.territory_connections OWNER TO postgres;

--
-- Name: territory_domination; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.territory_domination AS
 SELECT t.id,
    t.name,
    t.controlling_club_id,
    c.name AS club_name,
    c.logo_url,
    COALESCE(c.color, '#00d9ff'::text) AS club_color
   FROM (public.club_territories t
     LEFT JOIN public.clubs c ON ((c.id = t.controlling_club_id)));


ALTER VIEW public.territory_domination OWNER TO postgres;

--
-- Name: territory_economy; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.territory_economy AS
 SELECT id,
    name,
    controlling_club_id,
    gold_income,
    energy_income,
    upkeep_cost,
    (COALESCE(gold_income, 0) - COALESCE(upkeep_cost, 0)) AS net_gold
   FROM public.club_territories t;


ALTER VIEW public.territory_economy OWNER TO postgres;

--
-- Name: territory_influence; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.territory_influence AS
 SELECT territory_id,
    club_id,
    sum(power) AS influence
   FROM public.club_units
  GROUP BY territory_id, club_id;


ALTER VIEW public.territory_influence OWNER TO postgres;

--
-- Name: territory_influence_map; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.territory_influence_map AS
 WITH adjacency_base AS (
         SELECT t.id AS territory_id,
            t.name AS territory_name,
            t.controlling_club_id AS club_id,
            t.lat,
            t.lng,
            (COALESCE(sum(
                CASE
                    WHEN (adj.controlling_club_id = t.controlling_club_id) THEN 1
                    WHEN (adj.controlling_club_id IS NULL) THEN 0
                    ELSE '-1'::integer
                END), (0)::bigint))::integer AS adjacency_influence
           FROM ((public.club_territories t
             LEFT JOIN public.territory_adjacency ta ON ((ta.territory_id = t.id)))
             LEFT JOIN public.club_territories adj ON ((adj.id = ta.adjacent_territory_id)))
          GROUP BY t.id, t.name, t.controlling_club_id, t.lat, t.lng
        ), unit_pressure AS (
         SELECT cu.territory_id,
            cu.club_id,
            (COALESCE(sum(cu.power), (0)::bigint))::integer AS unit_power
           FROM public.club_units cu
          WHERE (cu.status = ANY (ARRAY['idle'::text, 'moving'::text, 'engaged'::text]))
          GROUP BY cu.territory_id, cu.club_id
        )
 SELECT territory_id,
    territory_name,
    club_id,
    lat,
    lng,
    (adjacency_influence + COALESCE(( SELECT (sum(
                CASE
                    WHEN (up.club_id = ab.club_id) THEN GREATEST(1, (up.unit_power / 10))
                    ELSE (- GREATEST(1, (up.unit_power / 10)))
                END))::integer AS sum
           FROM unit_pressure up
          WHERE (up.territory_id = ab.territory_id)), 0)) AS influence_score
   FROM adjacency_base ab;


ALTER VIEW public.territory_influence_map OWNER TO postgres;

--
-- Name: territory_paths; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territory_paths (
    from_territory_id uuid NOT NULL,
    to_territory_id uuid NOT NULL,
    cost integer DEFAULT 1
);


ALTER TABLE public.territory_paths OWNER TO postgres;

--
-- Name: unit_encounters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_encounters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    territory_id uuid NOT NULL,
    winner_club_id uuid,
    loser_club_id uuid,
    winner_power integer DEFAULT 0 NOT NULL,
    loser_power integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    total_rounds integer DEFAULT 0,
    battle_log jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.unit_encounters OWNER TO postgres;

--
-- Name: unit_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_id uuid NOT NULL,
    from_territory_id uuid NOT NULL,
    to_territory_id uuid NOT NULL,
    status text DEFAULT 'moving'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    arrival_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    progress double precision DEFAULT 0
);


ALTER TABLE public.unit_movements OWNER TO postgres;

--
-- Name: unit_movements_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.unit_movements_live AS
 SELECT um.id AS movement_id,
    um.unit_id,
    um.status,
    um.started_at,
    um.arrival_at,
    um.completed_at,
    cu.club_id,
    cu.unit_type,
    cu.power,
    cu.speed,
    ft.id AS from_territory_id,
    ft.name AS from_territory_name,
    ft.lat AS from_lat,
    ft.lng AS from_lng,
    tt.id AS to_territory_id,
    tt.name AS to_territory_name,
    tt.lat AS to_lat,
    tt.lng AS to_lng
   FROM (((public.unit_movements um
     JOIN public.club_units cu ON ((cu.id = um.unit_id)))
     JOIN public.club_territories ft ON ((ft.id = um.from_territory_id)))
     JOIN public.club_territories tt ON ((tt.id = um.to_territory_id)));


ALTER VIEW public.unit_movements_live OWNER TO postgres;

--
-- Name: unit_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    unit_id uuid NOT NULL,
    target_territory_id uuid NOT NULL,
    "position" integer DEFAULT 1 NOT NULL,
    status text DEFAULT 'queued'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    priority integer DEFAULT 1,
    command_mode text DEFAULT 'move'::text,
    formation text DEFAULT 'line'::text,
    path jsonb DEFAULT '[]'::jsonb
);


ALTER TABLE public.unit_orders OWNER TO postgres;

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    badge_type text NOT NULL,
    season_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- Name: user_balances; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.user_balances AS
 SELECT user_id,
    COALESCE(sum(amount), (0)::numeric) AS calculated_balance
   FROM public.arena_ledger
  GROUP BY user_id;


ALTER VIEW public.user_balances OWNER TO postgres;

--
-- Name: user_daily_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_daily_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    challenge_date date DEFAULT CURRENT_DATE NOT NULL,
    progress integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    xp_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_daily_challenges OWNER TO postgres;

--
-- Name: user_level_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_level_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    reward_id uuid NOT NULL,
    claimed_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_level_rewards OWNER TO postgres;

--
-- Name: user_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    value text,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    payload jsonb
);


ALTER TABLE public.user_notifications OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_season_tiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_season_tiers (
    user_id uuid NOT NULL,
    season_id uuid NOT NULL,
    tier text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_season_tiers OWNER TO postgres;

--
-- Name: v_matches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.v_matches (
    json_agg json
);


ALTER TABLE public.v_matches OWNER TO postgres;

--
-- Name: visible_territories; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.visible_territories AS
 SELECT DISTINCT t.id,
    t.name,
    t.slug,
    t.region,
    t.controlling_club_id,
    t.xp_bonus,
    t.arena_bonus,
    t.prestige_bonus,
    t.created_at,
    t.updated_at,
    t.map_key,
    t.x,
    t.y,
    t.is_capital,
    t.map_x,
    t.map_y,
    t.capture_progress,
    t.continent,
    t.strategic_value,
    t.siege_progress,
    t.bonus_type,
    t.bonus_value
   FROM (public.club_territories t
     LEFT JOIN public.alliance_members am ON ((am.club_id = t.controlling_club_id)));


ALTER VIEW public.visible_territories OWNER TO postgres;

--
-- Name: visible_territories_live; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.visible_territories_live AS
 WITH RECURSIVE territory_graph AS (
         SELECT ct_1.id,
            ct_1.id AS origin
           FROM public.club_territories ct_1
          WHERE (ct_1.controlling_club_id = auth.uid())
        UNION
         SELECT ta.adjacent_territory_id,
            tg_1.origin
           FROM (territory_graph tg_1
             JOIN public.territory_adjacency ta ON ((ta.territory_id = tg_1.id)))
        )
 SELECT DISTINCT ct.id,
    ct.name,
    ct.lat,
    ct.lng
   FROM (territory_graph tg
     JOIN public.club_territories ct ON ((ct.id = tg.id)));


ALTER VIEW public.visible_territories_live OWNER TO postgres;

--
-- Name: war_heatmap; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_heatmap AS
 SELECT w.id AS war_id,
    w.territory_id,
    ct.name AS territory_name,
    ct.longitude,
    ct.latitude,
    COALESCE(sum(wc.xp), (0)::bigint) AS total_xp,
    count(wc.id) AS contributions_count,
    (LEAST((100)::bigint, ((COALESCE(sum(wc.xp), (0)::bigint) / 10) + (count(wc.id) * 2))))::integer AS intensity
   FROM ((public.club_wars w
     LEFT JOIN public.war_contributions wc ON ((wc.war_id = w.id)))
     LEFT JOIN public.club_territories ct ON ((ct.id = w.territory_id)))
  WHERE (w.status = 'active'::text)
  GROUP BY w.id, w.territory_id, ct.name, ct.longitude, ct.latitude;


ALTER VIEW public.war_heatmap OWNER TO postgres;

--
-- Name: war_live_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_live_stats AS
 SELECT w.id AS war_id,
    w.challenger_id,
    w.defender_id,
    COALESCE(sum(
        CASE
            WHEN (wc.club_id = w.challenger_id) THEN wc.xp
            ELSE 0
        END), (0)::bigint) AS attacker_xp,
    COALESCE(sum(
        CASE
            WHEN (wc.club_id = w.defender_id) THEN wc.xp
            ELSE 0
        END), (0)::bigint) AS defender_xp,
    COALESCE(sum(wc.xp), (0)::bigint) AS total_xp
   FROM (public.club_wars w
     LEFT JOIN public.war_contributions wc ON ((wc.war_id = w.id)))
  GROUP BY w.id, w.challenger_id, w.defender_id;


ALTER VIEW public.war_live_stats OWNER TO postgres;

--
-- Name: war_map_data; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_map_data AS
 SELECT ct.id AS territory_id,
    ct.name,
    ct.lat,
    ct.lng,
    ct.controlling_club_id,
    c.name AS club_name,
    c.logo_url,
    cw.id AS war_id,
    cw.status
   FROM ((public.club_territories ct
     LEFT JOIN public.clubs c ON ((c.id = ct.controlling_club_id)))
     LEFT JOIN public.club_wars cw ON (((cw.territory_id = ct.id) AND (cw.status = 'active'::text))));


ALTER VIEW public.war_map_data OWNER TO postgres;

--
-- Name: war_map_full; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_map_full AS
 SELECT ct.id AS territory_id,
    ct.name AS territory_name,
    ct.lat,
    ct.lng,
    ct.gold_income,
    ct.energy_income,
    ct.upkeep_cost,
    ct.capture_progress,
    c.id AS club_id,
    c.name AS club_name,
    c.logo_url,
    COALESCE(c.color, '#00d9ff'::text) AS club_color,
    ao.id AS alliance_id,
    ao.name AS alliance_name,
    cw.id AS war_id,
    cw.status,
    COALESCE(wh.total_xp, (0)::bigint) AS total_xp
   FROM (((((public.club_territories ct
     LEFT JOIN public.clubs c ON ((c.id = ct.controlling_club_id)))
     LEFT JOIN public.alliance_members am ON ((am.club_id = c.id)))
     LEFT JOIN public.alliances ao ON ((ao.id = am.alliance_id)))
     LEFT JOIN public.club_wars cw ON (((cw.territory_id = ct.id) AND (cw.status = 'active'::text))))
     LEFT JOIN public.war_heatmap wh ON ((wh.territory_id = ct.id)));


ALTER VIEW public.war_map_full OWNER TO postgres;

--
-- Name: war_mvp; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_mvp AS
 SELECT war_id,
    user_id,
    sum(xp) AS total_xp
   FROM public.war_contributions wc
  GROUP BY war_id, user_id;


ALTER VIEW public.war_mvp OWNER TO postgres;

--
-- Name: war_mvp_top; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_mvp_top AS
 SELECT DISTINCT ON (wc.war_id) wc.war_id,
    wc.user_id,
    COALESCE(p.display_name, p.username, 'Anonymous'::text) AS username,
    p.avatar_url,
    sum(wc.xp) AS total_xp
   FROM (public.war_contributions wc
     LEFT JOIN public.profiles p ON ((p.id = wc.user_id)))
  GROUP BY wc.war_id, wc.user_id, p.display_name, p.username, p.avatar_url
  ORDER BY wc.war_id, (sum(wc.xp)) DESC;


ALTER VIEW public.war_mvp_top OWNER TO postgres;

--
-- Name: war_stats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.war_stats AS
 SELECT war_id,
    sum(xp) AS total_xp
   FROM public.war_contributions
  GROUP BY war_id;


ALTER VIEW public.war_stats OWNER TO postgres;

--
-- Name: weekly_rankings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_rankings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    week_start date NOT NULL,
    week_end date NOT NULL,
    arena_score integer DEFAULT 0 NOT NULL,
    predictions_count integer DEFAULT 0 NOT NULL,
    accuracy numeric DEFAULT 0 NOT NULL,
    final_rank integer,
    rewards_claimed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.weekly_rankings OWNER TO postgres;

--
-- Name: weekly_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rank_from integer NOT NULL,
    rank_to integer NOT NULL,
    arena_points integer NOT NULL,
    badge_id uuid,
    description text,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.weekly_rewards OWNER TO postgres;

--
-- Name: world_boss; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.world_boss (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    max_hp integer NOT NULL,
    current_hp integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    status text DEFAULT 'active'::text
);


ALTER TABLE public.world_boss OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: messages_2026_03_19; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_19 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_20; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_20 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_21; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_21 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_22; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_22 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_23; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_23 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_23 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_24; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_24 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_24 OWNER TO supabase_admin;

--
-- Name: messages_2026_03_25; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.messages_2026_03_25 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE realtime.messages_2026_03_25 OWNER TO supabase_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- Name: messages_2026_03_19; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_19 FOR VALUES FROM ('2026-03-19 00:00:00') TO ('2026-03-20 00:00:00');


--
-- Name: messages_2026_03_20; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_20 FOR VALUES FROM ('2026-03-20 00:00:00') TO ('2026-03-21 00:00:00');


--
-- Name: messages_2026_03_21; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_21 FOR VALUES FROM ('2026-03-21 00:00:00') TO ('2026-03-22 00:00:00');


--
-- Name: messages_2026_03_22; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_22 FOR VALUES FROM ('2026-03-22 00:00:00') TO ('2026-03-23 00:00:00');


--
-- Name: messages_2026_03_23; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_23 FOR VALUES FROM ('2026-03-23 00:00:00') TO ('2026-03-24 00:00:00');


--
-- Name: messages_2026_03_24; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_24 FOR VALUES FROM ('2026-03-24 00:00:00') TO ('2026-03-25 00:00:00');


--
-- Name: messages_2026_03_25; Type: TABLE ATTACH; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2026_03_25 FOR VALUES FROM ('2026-03-25 00:00:00') TO ('2026-03-26 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: alliance_invites alliance_invites_alliance_id_club_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_invites
    ADD CONSTRAINT alliance_invites_alliance_id_club_id_key UNIQUE (alliance_id, club_id);


--
-- Name: alliance_invites alliance_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_invites
    ADD CONSTRAINT alliance_invites_pkey PRIMARY KEY (id);


--
-- Name: alliance_members alliance_members_alliance_id_club_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_members
    ADD CONSTRAINT alliance_members_alliance_id_club_id_key UNIQUE (alliance_id, club_id);


--
-- Name: alliance_members alliance_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_members
    ADD CONSTRAINT alliance_members_pkey PRIMARY KEY (id);


--
-- Name: alliances alliances_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliances
    ADD CONSTRAINT alliances_name_key UNIQUE (name);


--
-- Name: alliances alliances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliances
    ADD CONSTRAINT alliances_pkey PRIMARY KEY (id);


--
-- Name: arena_ledger arena_ledger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arena_ledger
    ADD CONSTRAINT arena_ledger_pkey PRIMARY KEY (id);


--
-- Name: arena_prizes arena_prizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arena_prizes
    ADD CONSTRAINT arena_prizes_pkey PRIMARY KEY (id);


--
-- Name: arena_prizes arena_prizes_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arena_prizes
    ADD CONSTRAINT arena_prizes_sku_key UNIQUE (sku);


--
-- Name: arena_transactions arena_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arena_transactions
    ADD CONSTRAINT arena_transactions_pkey PRIMARY KEY (id);


--
-- Name: army_group_units army_group_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.army_group_units
    ADD CONSTRAINT army_group_units_pkey PRIMARY KEY (group_id, unit_id);


--
-- Name: army_groups army_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.army_groups
    ADD CONSTRAINT army_groups_pkey PRIMARY KEY (id);


--
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (id);


--
-- Name: battle_logs battle_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.battle_logs
    ADD CONSTRAINT battle_logs_pkey PRIMARY KEY (id);


--
-- Name: boss_damage boss_damage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_damage
    ADD CONSTRAINT boss_damage_pkey PRIMARY KEY (id);


--
-- Name: club_activities club_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_activities
    ADD CONSTRAINT club_activities_pkey PRIMARY KEY (id);


--
-- Name: club_ban_appeals club_ban_appeals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_ban_appeals
    ADD CONSTRAINT club_ban_appeals_pkey PRIMARY KEY (id);


--
-- Name: club_banned_members club_banned_members_club_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_banned_members
    ADD CONSTRAINT club_banned_members_club_id_user_id_key UNIQUE (club_id, user_id);


--
-- Name: club_banned_members club_banned_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_banned_members
    ADD CONSTRAINT club_banned_members_pkey PRIMARY KEY (id);


--
-- Name: club_challenge_contributions club_challenge_contributions_challenge_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenge_contributions
    ADD CONSTRAINT club_challenge_contributions_challenge_id_user_id_key UNIQUE (challenge_id, user_id);


--
-- Name: club_challenge_contributions club_challenge_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenge_contributions
    ADD CONSTRAINT club_challenge_contributions_pkey PRIMARY KEY (id);


--
-- Name: club_challenge_templates club_challenge_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenge_templates
    ADD CONSTRAINT club_challenge_templates_pkey PRIMARY KEY (id);


--
-- Name: club_challenges club_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenges
    ADD CONSTRAINT club_challenges_pkey PRIMARY KEY (id);


--
-- Name: club_join_requests club_join_requests_club_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_join_requests
    ADD CONSTRAINT club_join_requests_club_id_user_id_key UNIQUE (club_id, user_id);


--
-- Name: club_join_requests club_join_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_join_requests
    ADD CONSTRAINT club_join_requests_pkey PRIMARY KEY (id);


--
-- Name: club_members club_members_club_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_members
    ADD CONSTRAINT club_members_club_id_user_id_key UNIQUE (club_id, user_id);


--
-- Name: club_members club_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_members
    ADD CONSTRAINT club_members_pkey PRIMARY KEY (id);


--
-- Name: club_members club_members_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_members
    ADD CONSTRAINT club_members_unique UNIQUE (club_id, user_id);


--
-- Name: club_message_reactions club_message_reactions_message_id_user_id_emoji_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_message_reactions
    ADD CONSTRAINT club_message_reactions_message_id_user_id_emoji_key UNIQUE (message_id, user_id, emoji);


--
-- Name: club_message_reactions club_message_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_message_reactions
    ADD CONSTRAINT club_message_reactions_pkey PRIMARY KEY (id);


--
-- Name: club_messages club_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_messages
    ADD CONSTRAINT club_messages_pkey PRIMARY KEY (id);


--
-- Name: club_moderation_logs club_moderation_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_moderation_logs
    ADD CONSTRAINT club_moderation_logs_pkey PRIMARY KEY (id);


--
-- Name: club_muted_members club_muted_members_club_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_muted_members
    ADD CONSTRAINT club_muted_members_club_id_user_id_key UNIQUE (club_id, user_id);


--
-- Name: club_muted_members club_muted_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_muted_members
    ADD CONSTRAINT club_muted_members_pkey PRIMARY KEY (id);


--
-- Name: club_poll_options club_poll_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_options
    ADD CONSTRAINT club_poll_options_pkey PRIMARY KEY (id);


--
-- Name: club_poll_votes club_poll_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_votes
    ADD CONSTRAINT club_poll_votes_pkey PRIMARY KEY (id);


--
-- Name: club_poll_votes club_poll_votes_poll_id_user_id_option_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_votes
    ADD CONSTRAINT club_poll_votes_poll_id_user_id_option_id_key UNIQUE (poll_id, user_id, option_id);


--
-- Name: club_polls club_polls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_polls
    ADD CONSTRAINT club_polls_pkey PRIMARY KEY (id);


--
-- Name: club_rewards club_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_rewards
    ADD CONSTRAINT club_rewards_pkey PRIMARY KEY (id);


--
-- Name: club_rivalries club_rivalries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_rivalries
    ADD CONSTRAINT club_rivalries_pkey PRIMARY KEY (id);


--
-- Name: club_season_rankings club_season_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_rankings
    ADD CONSTRAINT club_season_rankings_pkey PRIMARY KEY (id);


--
-- Name: club_season_rankings club_season_rankings_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_rankings
    ADD CONSTRAINT club_season_rankings_unique UNIQUE (season_id, club_id);


--
-- Name: club_season_rewards club_season_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_rewards
    ADD CONSTRAINT club_season_rewards_pkey PRIMARY KEY (id);


--
-- Name: club_season_stats club_season_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_stats
    ADD CONSTRAINT club_season_stats_pkey PRIMARY KEY (id);


--
-- Name: club_season_stats club_season_stats_season_id_club_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_stats
    ADD CONSTRAINT club_season_stats_season_id_club_id_key UNIQUE (season_id, club_id);


--
-- Name: club_seasons club_seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_seasons
    ADD CONSTRAINT club_seasons_pkey PRIMARY KEY (id);


--
-- Name: club_territories club_territories_map_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_territories
    ADD CONSTRAINT club_territories_map_key_key UNIQUE (map_key);


--
-- Name: club_territories club_territories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_territories
    ADD CONSTRAINT club_territories_pkey PRIMARY KEY (id);


--
-- Name: club_territories club_territories_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_territories
    ADD CONSTRAINT club_territories_slug_key UNIQUE (slug);


--
-- Name: club_units club_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_units
    ADD CONSTRAINT club_units_pkey PRIMARY KEY (id);


--
-- Name: club_war_scores club_war_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_war_scores
    ADD CONSTRAINT club_war_scores_pkey PRIMARY KEY (id);


--
-- Name: club_wars club_wars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_pkey PRIMARY KEY (id);


--
-- Name: club_weekly_rankings club_weekly_rankings_club_id_week_start_week_end_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_weekly_rankings
    ADD CONSTRAINT club_weekly_rankings_club_id_week_start_week_end_key UNIQUE (club_id, week_start, week_end);


--
-- Name: club_weekly_rankings club_weekly_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_weekly_rankings
    ADD CONSTRAINT club_weekly_rankings_pkey PRIMARY KEY (id);


--
-- Name: clubs clubs_discord_server_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_discord_server_id_key UNIQUE (discord_server_id);


--
-- Name: clubs clubs_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_name_key UNIQUE (name);


--
-- Name: clubs clubs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_pkey PRIMARY KEY (id);


--
-- Name: clubs clubs_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_slug_key UNIQUE (slug);


--
-- Name: cosmetics cosmetics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetics
    ADD CONSTRAINT cosmetics_pkey PRIMARY KEY (id);


--
-- Name: daily_challenges daily_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_challenges
    ADD CONSTRAINT daily_challenges_pkey PRIMARY KEY (id);


--
-- Name: guild_tournament_entries guild_tournament_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournament_entries
    ADD CONSTRAINT guild_tournament_entries_pkey PRIMARY KEY (id);


--
-- Name: guild_tournament_entries guild_tournament_entries_tournament_id_club_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournament_entries
    ADD CONSTRAINT guild_tournament_entries_tournament_id_club_id_key UNIQUE (tournament_id, club_id);


--
-- Name: guild_tournaments guild_tournaments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournaments
    ADD CONSTRAINT guild_tournaments_pkey PRIMARY KEY (id);


--
-- Name: level_rewards level_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.level_rewards
    ADD CONSTRAINT level_rewards_pkey PRIMARY KEY (id);


--
-- Name: matches matches_external_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_external_id_unique UNIQUE (external_id);


--
-- Name: matches matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_pkey PRIMARY KEY (id);


--
-- Name: player_cosmetics player_cosmetics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_cosmetics
    ADD CONSTRAINT player_cosmetics_pkey PRIMARY KEY (id);


--
-- Name: player_prestige player_prestige_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_prestige
    ADD CONSTRAINT player_prestige_pkey PRIMARY KEY (id);


--
-- Name: predictions predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_pkey PRIMARY KEY (id);


--
-- Name: prize_redemptions prize_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prize_redemptions
    ADD CONSTRAINT prize_redemptions_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_discord_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_discord_id_key UNIQUE (discord_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: ranked_matches ranked_matches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_user_id_action_type_window_start_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_user_id_action_type_window_start_key UNIQUE (user_id, action_type, window_start);


--
-- Name: referral_codes referral_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_codes
    ADD CONSTRAINT referral_codes_code_key UNIQUE (code);


--
-- Name: referral_codes referral_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_codes
    ADD CONSTRAINT referral_codes_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: season_club_scores season_club_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_club_scores
    ADD CONSTRAINT season_club_scores_pkey PRIMARY KEY (id);


--
-- Name: season_hall_of_fame season_hall_of_fame_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_hall_of_fame
    ADD CONSTRAINT season_hall_of_fame_pkey PRIMARY KEY (id);


--
-- Name: season_xp season_user_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_xp
    ADD CONSTRAINT season_user_unique UNIQUE (season_id, user_id);


--
-- Name: season_xp season_xp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_xp
    ADD CONSTRAINT season_xp_pkey PRIMARY KEY (id);


--
-- Name: season_xp season_xp_season_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_xp
    ADD CONSTRAINT season_xp_season_id_user_id_key UNIQUE (season_id, user_id);


--
-- Name: seasons seasons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seasons
    ADD CONSTRAINT seasons_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: support_inquiries support_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_inquiries
    ADD CONSTRAINT support_inquiries_pkey PRIMARY KEY (id);


--
-- Name: territory_adjacency territory_adjacency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_adjacency
    ADD CONSTRAINT territory_adjacency_pkey PRIMARY KEY (id);


--
-- Name: territory_adjacency territory_adjacency_territory_id_adjacent_territory_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_adjacency
    ADD CONSTRAINT territory_adjacency_territory_id_adjacent_territory_id_key UNIQUE (territory_id, adjacent_territory_id);


--
-- Name: territory_connections territory_connections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_connections
    ADD CONSTRAINT territory_connections_pkey PRIMARY KEY (id);


--
-- Name: territory_paths territory_paths_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_paths
    ADD CONSTRAINT territory_paths_pkey PRIMARY KEY (from_territory_id, to_territory_id);


--
-- Name: club_rivalries unique_rivalry; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_rivalries
    ADD CONSTRAINT unique_rivalry UNIQUE (club_a, club_b);


--
-- Name: unit_encounters unit_encounters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_encounters
    ADD CONSTRAINT unit_encounters_pkey PRIMARY KEY (id);


--
-- Name: unit_movements unit_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_movements
    ADD CONSTRAINT unit_movements_pkey PRIMARY KEY (id);


--
-- Name: unit_orders unit_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_orders
    ADD CONSTRAINT unit_orders_pkey PRIMARY KEY (id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (id);


--
-- Name: user_daily_challenges user_daily_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_daily_challenges
    ADD CONSTRAINT user_daily_challenges_pkey PRIMARY KEY (id);


--
-- Name: user_daily_challenges user_daily_challenges_user_id_challenge_id_challenge_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_daily_challenges
    ADD CONSTRAINT user_daily_challenges_user_id_challenge_id_challenge_date_key UNIQUE (user_id, challenge_id, challenge_date);


--
-- Name: user_level_rewards user_level_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_level_rewards
    ADD CONSTRAINT user_level_rewards_pkey PRIMARY KEY (id);


--
-- Name: user_level_rewards user_level_rewards_user_id_reward_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_level_rewards
    ADD CONSTRAINT user_level_rewards_user_id_reward_id_key UNIQUE (user_id, reward_id);


--
-- Name: user_notifications user_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_notifications
    ADD CONSTRAINT user_notifications_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: user_season_tiers user_season_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_season_tiers
    ADD CONSTRAINT user_season_tiers_pkey PRIMARY KEY (user_id, season_id);


--
-- Name: war_contributions war_contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.war_contributions
    ADD CONSTRAINT war_contributions_pkey PRIMARY KEY (id);


--
-- Name: weekly_rankings weekly_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_rankings
    ADD CONSTRAINT weekly_rankings_pkey PRIMARY KEY (id);


--
-- Name: weekly_rankings weekly_rankings_user_id_week_start_week_end_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_rankings
    ADD CONSTRAINT weekly_rankings_user_id_week_start_week_end_key UNIQUE (user_id, week_start, week_end);


--
-- Name: weekly_rewards weekly_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_rewards
    ADD CONSTRAINT weekly_rewards_pkey PRIMARY KEY (id);


--
-- Name: world_boss world_boss_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.world_boss
    ADD CONSTRAINT world_boss_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_19 messages_2026_03_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_19
    ADD CONSTRAINT messages_2026_03_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_20 messages_2026_03_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_20
    ADD CONSTRAINT messages_2026_03_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_21 messages_2026_03_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_21
    ADD CONSTRAINT messages_2026_03_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_22 messages_2026_03_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_22
    ADD CONSTRAINT messages_2026_03_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_23 messages_2026_03_23_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_23
    ADD CONSTRAINT messages_2026_03_23_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_24 messages_2026_03_24_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_24
    ADD CONSTRAINT messages_2026_03_24_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2026_03_25 messages_2026_03_25_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.messages_2026_03_25
    ADD CONSTRAINT messages_2026_03_25_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: club_war_scores_war_id_club_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX club_war_scores_war_id_club_id_idx ON public.club_war_scores USING btree (war_id, club_id);


--
-- Name: idx_alliance_invites_alliance_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliance_invites_alliance_id ON public.alliance_invites USING btree (alliance_id);


--
-- Name: idx_alliance_invites_club_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliance_invites_club_id ON public.alliance_invites USING btree (club_id);


--
-- Name: idx_alliance_members_alliance_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliance_members_alliance_id ON public.alliance_members USING btree (alliance_id);


--
-- Name: idx_alliance_members_club_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliance_members_club_id ON public.alliance_members USING btree (club_id);


--
-- Name: idx_alliances_owner_club_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliances_owner_club_id ON public.alliances USING btree (owner_club_id);


--
-- Name: idx_alliances_season_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_alliances_season_id ON public.alliances USING btree (season_id);


--
-- Name: idx_arena_tx_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_arena_tx_reference ON public.arena_transactions USING btree (reference_id);


--
-- Name: idx_arena_tx_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_arena_tx_type ON public.arena_transactions USING btree (transaction_type);


--
-- Name: idx_arena_tx_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_arena_tx_user ON public.arena_transactions USING btree (user_id, created_at DESC);


--
-- Name: idx_club_members_club; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_members_club ON public.club_members USING btree (club_id);


--
-- Name: idx_club_members_club_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_members_club_id ON public.club_members USING btree (club_id);


--
-- Name: idx_club_members_user_club; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_members_user_club ON public.club_members USING btree (user_id, club_id);


--
-- Name: idx_club_messages_club_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_messages_club_created ON public.club_messages USING btree (club_id, created_at DESC);


--
-- Name: idx_club_messages_pinned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_messages_pinned ON public.club_messages USING btree (club_id) WHERE (is_pinned = true);


--
-- Name: idx_club_season_rankings_club; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_season_rankings_club ON public.club_season_rankings USING btree (club_id);


--
-- Name: idx_club_season_rankings_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_season_rankings_rank ON public.club_season_rankings USING btree (rank);


--
-- Name: idx_club_season_rankings_season; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_season_rankings_season ON public.club_season_rankings USING btree (season_id);


--
-- Name: idx_club_seasons_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_seasons_status ON public.club_seasons USING btree (status);


--
-- Name: idx_club_territories_coords; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_territories_coords ON public.club_territories USING btree (lat, lng);


--
-- Name: idx_club_wars_challenger; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_wars_challenger ON public.club_wars USING btree (challenger_id);


--
-- Name: idx_club_wars_defender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_wars_defender ON public.club_wars USING btree (defender_id);


--
-- Name: idx_club_wars_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_club_wars_status ON public.club_wars USING btree (status);


--
-- Name: idx_clubs_leaderboard; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_leaderboard ON public.clubs USING btree (total_xp DESC);


--
-- Name: idx_clubs_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_slug ON public.clubs USING btree (slug);


--
-- Name: idx_clubs_total_xp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_clubs_total_xp ON public.clubs USING btree (total_xp DESC);


--
-- Name: idx_contributions_war; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contributions_war ON public.war_contributions USING btree (war_id);


--
-- Name: idx_hof_season; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hof_season ON public.season_hall_of_fame USING btree (season_id);


--
-- Name: idx_hof_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hof_user ON public.season_hall_of_fame USING btree (user_id);


--
-- Name: idx_predictions_match_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predictions_match_status ON public.predictions USING btree (match_id, status) WHERE (status = 'pending'::text);


--
-- Name: idx_predictions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predictions_user ON public.predictions USING btree (user_id);


--
-- Name: idx_predictions_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_predictions_user_created ON public.predictions USING btree (user_id, created_at DESC);


--
-- Name: idx_rate_limits; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rate_limits ON public.rate_limits USING btree (user_id, action_type, window_start);


--
-- Name: idx_redemptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_redemptions_status ON public.prize_redemptions USING btree (status);


--
-- Name: idx_redemptions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_redemptions_user ON public.prize_redemptions USING btree (user_id, created_at DESC);


--
-- Name: idx_territories_control; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_territories_control ON public.club_territories USING btree (controlling_club_id);


--
-- Name: idx_territories_coords; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_territories_coords ON public.club_territories USING btree (lat, lng);


--
-- Name: idx_unit_movements_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unit_movements_status ON public.unit_movements USING btree (status);


--
-- Name: idx_unit_movements_unit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unit_movements_unit_id ON public.unit_movements USING btree (unit_id);


--
-- Name: idx_unit_orders_priority; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unit_orders_priority ON public.unit_orders USING btree (priority DESC, created_at);


--
-- Name: idx_unit_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unit_orders_status ON public.unit_orders USING btree (status);


--
-- Name: idx_unit_orders_unit_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_unit_orders_unit_id ON public.unit_orders USING btree (unit_id);


--
-- Name: idx_user_notifications_user_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_notifications_user_read ON public.user_notifications USING btree (user_id, is_read) WHERE (is_read = false);


--
-- Name: idx_wars_challenger; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wars_challenger ON public.club_wars USING btree (challenger_id);


--
-- Name: idx_wars_defender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wars_defender ON public.club_wars USING btree (defender_id);


--
-- Name: one_alliance_per_club; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX one_alliance_per_club ON public.alliance_members USING btree (club_id);


--
-- Name: only_one_active_season; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX only_one_active_season ON public.seasons USING btree (is_active) WHERE (is_active = true);


--
-- Name: unique_active_war_per_challenger; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_active_war_per_challenger ON public.club_wars USING btree (challenger_id) WHERE (status = 'active'::text);


--
-- Name: unique_active_war_per_defender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_active_war_per_defender ON public.club_wars USING btree (defender_id) WHERE (status = 'active'::text);


--
-- Name: unique_member_per_club; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_member_per_club ON public.club_members USING btree (club_id, user_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_19_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_19_inserted_at_topic_idx ON realtime.messages_2026_03_19 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_20_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_20_inserted_at_topic_idx ON realtime.messages_2026_03_20 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_21_inserted_at_topic_idx ON realtime.messages_2026_03_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_22_inserted_at_topic_idx ON realtime.messages_2026_03_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_23_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_23_inserted_at_topic_idx ON realtime.messages_2026_03_23 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_24_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_24_inserted_at_topic_idx ON realtime.messages_2026_03_24 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2026_03_25_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX messages_2026_03_25_inserted_at_topic_idx ON realtime.messages_2026_03_25 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: messages_2026_03_19_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_19_inserted_at_topic_idx;


--
-- Name: messages_2026_03_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_19_pkey;


--
-- Name: messages_2026_03_20_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_20_inserted_at_topic_idx;


--
-- Name: messages_2026_03_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_20_pkey;


--
-- Name: messages_2026_03_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_21_inserted_at_topic_idx;


--
-- Name: messages_2026_03_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_21_pkey;


--
-- Name: messages_2026_03_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_22_inserted_at_topic_idx;


--
-- Name: messages_2026_03_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_22_pkey;


--
-- Name: messages_2026_03_23_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_23_inserted_at_topic_idx;


--
-- Name: messages_2026_03_23_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_23_pkey;


--
-- Name: messages_2026_03_24_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_24_inserted_at_topic_idx;


--
-- Name: messages_2026_03_24_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_24_pkey;


--
-- Name: messages_2026_03_25_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2026_03_25_inserted_at_topic_idx;


--
-- Name: messages_2026_03_25_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2026_03_25_pkey;


--
-- Name: club_stats _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.club_stats AS
 SELECT c.id,
    c.name,
    c.slug,
    c.total_xp,
    c.total_wins,
    c.total_predictions,
    count(cm.id) AS member_count,
        CASE
            WHEN (c.total_predictions = 0) THEN (0)::numeric
            ELSE round((((c.total_wins)::numeric / (c.total_predictions)::numeric) * (100)::numeric))
        END AS accuracy
   FROM (public.clubs c
     LEFT JOIN public.club_members cm ON ((cm.club_id = c.id)))
  GROUP BY c.id;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: club_members club_member_xp_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER club_member_xp_update AFTER UPDATE OF xp_contributed ON public.club_members FOR EACH ROW EXECUTE FUNCTION public.update_club_war_xp();


--
-- Name: club_units trg_auto_battle; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auto_battle AFTER INSERT OR UPDATE ON public.club_units FOR EACH ROW EXECUTE FUNCTION public.check_auto_battle();


--
-- Name: war_contributions trigger_auto_resolve_war; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_auto_resolve_war AFTER INSERT ON public.war_contributions FOR EACH ROW EXECUTE FUNCTION public.trigger_check_and_resolve_war();


--
-- Name: predictions trigger_prediction_club_xp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_prediction_club_xp AFTER UPDATE ON public.predictions FOR EACH ROW WHEN ((new.status = 'won'::text)) EXECUTE FUNCTION public.apply_club_xp_from_prediction();


--
-- Name: war_contributions trigger_war_completion; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_war_completion AFTER INSERT ON public.war_contributions FOR EACH ROW EXECUTE FUNCTION public.check_war_completion();


--
-- Name: arena_ledger update_balance_after_ledger_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_balance_after_ledger_insert AFTER INSERT ON public.arena_ledger FOR EACH ROW EXECUTE FUNCTION public.sync_balance_from_ledger();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: alliance_invites alliance_invites_alliance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_invites
    ADD CONSTRAINT alliance_invites_alliance_id_fkey FOREIGN KEY (alliance_id) REFERENCES public.alliances(id) ON DELETE CASCADE;


--
-- Name: alliance_invites alliance_invites_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_invites
    ADD CONSTRAINT alliance_invites_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: alliance_invites alliance_invites_invited_by_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_invites
    ADD CONSTRAINT alliance_invites_invited_by_club_id_fkey FOREIGN KEY (invited_by_club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: alliance_members alliance_members_alliance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_members
    ADD CONSTRAINT alliance_members_alliance_id_fkey FOREIGN KEY (alliance_id) REFERENCES public.alliances(id) ON DELETE CASCADE;


--
-- Name: alliance_members alliance_members_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliance_members
    ADD CONSTRAINT alliance_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: alliances alliances_owner_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliances
    ADD CONSTRAINT alliances_owner_club_id_fkey FOREIGN KEY (owner_club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: alliances alliances_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alliances
    ADD CONSTRAINT alliances_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE SET NULL;


--
-- Name: arena_transactions arena_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arena_transactions
    ADD CONSTRAINT arena_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: army_group_units army_group_units_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.army_group_units
    ADD CONSTRAINT army_group_units_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.army_groups(id) ON DELETE CASCADE;


--
-- Name: army_group_units army_group_units_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.army_group_units
    ADD CONSTRAINT army_group_units_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.club_units(id) ON DELETE CASCADE;


--
-- Name: boss_damage boss_damage_boss_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_damage
    ADD CONSTRAINT boss_damage_boss_id_fkey FOREIGN KEY (boss_id) REFERENCES public.world_boss(id);


--
-- Name: boss_damage boss_damage_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boss_damage
    ADD CONSTRAINT boss_damage_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_activities club_activities_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_activities
    ADD CONSTRAINT club_activities_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_ban_appeals club_ban_appeals_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_ban_appeals
    ADD CONSTRAINT club_ban_appeals_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_banned_members club_banned_members_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_banned_members
    ADD CONSTRAINT club_banned_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_challenge_contributions club_challenge_contributions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenge_contributions
    ADD CONSTRAINT club_challenge_contributions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.club_challenges(id);


--
-- Name: club_challenges club_challenges_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenges
    ADD CONSTRAINT club_challenges_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_challenges club_challenges_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_challenges
    ADD CONSTRAINT club_challenges_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.club_challenge_templates(id);


--
-- Name: club_join_requests club_join_requests_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_join_requests
    ADD CONSTRAINT club_join_requests_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_members club_members_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_members
    ADD CONSTRAINT club_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_message_reactions club_message_reactions_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_message_reactions
    ADD CONSTRAINT club_message_reactions_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.club_messages(id);


--
-- Name: club_messages club_messages_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_messages
    ADD CONSTRAINT club_messages_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_messages club_messages_reply_to_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_messages
    ADD CONSTRAINT club_messages_reply_to_id_fkey FOREIGN KEY (reply_to_id) REFERENCES public.club_messages(id);


--
-- Name: club_moderation_logs club_moderation_logs_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_moderation_logs
    ADD CONSTRAINT club_moderation_logs_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_muted_members club_muted_members_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_muted_members
    ADD CONSTRAINT club_muted_members_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_poll_options club_poll_options_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_options
    ADD CONSTRAINT club_poll_options_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.club_polls(id);


--
-- Name: club_poll_votes club_poll_votes_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_votes
    ADD CONSTRAINT club_poll_votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.club_poll_options(id);


--
-- Name: club_poll_votes club_poll_votes_poll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_poll_votes
    ADD CONSTRAINT club_poll_votes_poll_id_fkey FOREIGN KEY (poll_id) REFERENCES public.club_polls(id);


--
-- Name: club_polls club_polls_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_polls
    ADD CONSTRAINT club_polls_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: club_polls club_polls_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_polls
    ADD CONSTRAINT club_polls_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.club_messages(id);


--
-- Name: club_rivalries club_rivalries_club_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_rivalries
    ADD CONSTRAINT club_rivalries_club_a_fkey FOREIGN KEY (club_a) REFERENCES public.clubs(id);


--
-- Name: club_rivalries club_rivalries_club_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_rivalries
    ADD CONSTRAINT club_rivalries_club_b_fkey FOREIGN KEY (club_b) REFERENCES public.clubs(id);


--
-- Name: club_season_rankings club_season_rankings_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_rankings
    ADD CONSTRAINT club_season_rankings_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: club_season_rankings club_season_rankings_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_rankings
    ADD CONSTRAINT club_season_rankings_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.club_seasons(id) ON DELETE CASCADE;


--
-- Name: club_season_stats club_season_stats_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_stats
    ADD CONSTRAINT club_season_stats_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: club_season_stats club_season_stats_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_season_stats
    ADD CONSTRAINT club_season_stats_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: club_territories club_territories_controlling_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_territories
    ADD CONSTRAINT club_territories_controlling_club_id_fkey FOREIGN KEY (controlling_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;


--
-- Name: club_units club_units_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_units
    ADD CONSTRAINT club_units_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: club_units club_units_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_units
    ADD CONSTRAINT club_units_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: club_war_scores club_war_scores_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_war_scores
    ADD CONSTRAINT club_war_scores_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: club_war_scores club_war_scores_war_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_war_scores
    ADD CONSTRAINT club_war_scores_war_id_fkey FOREIGN KEY (war_id) REFERENCES public.club_wars(id) ON DELETE CASCADE;


--
-- Name: club_wars club_wars_challenger_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_challenger_id_fkey FOREIGN KEY (challenger_id) REFERENCES public.clubs(id);


--
-- Name: club_wars club_wars_defender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_defender_id_fkey FOREIGN KEY (defender_id) REFERENCES public.clubs(id);


--
-- Name: club_wars club_wars_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id);


--
-- Name: club_wars club_wars_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.club_territories(id) ON DELETE SET NULL;


--
-- Name: club_wars club_wars_winner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_wars
    ADD CONSTRAINT club_wars_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.clubs(id);


--
-- Name: club_weekly_rankings club_weekly_rankings_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_weekly_rankings
    ADD CONSTRAINT club_weekly_rankings_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id);


--
-- Name: guild_tournament_entries guild_tournament_entries_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournament_entries
    ADD CONSTRAINT guild_tournament_entries_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: guild_tournament_entries guild_tournament_entries_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournament_entries
    ADD CONSTRAINT guild_tournament_entries_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.guild_tournaments(id) ON DELETE CASCADE;


--
-- Name: guild_tournaments guild_tournaments_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guild_tournaments
    ADD CONSTRAINT guild_tournaments_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE SET NULL;


--
-- Name: matches matches_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.matches
    ADD CONSTRAINT matches_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id);


--
-- Name: player_cosmetics player_cosmetics_cosmetic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_cosmetics
    ADD CONSTRAINT player_cosmetics_cosmetic_id_fkey FOREIGN KEY (cosmetic_id) REFERENCES public.cosmetics(id);


--
-- Name: player_cosmetics player_cosmetics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_cosmetics
    ADD CONSTRAINT player_cosmetics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: player_prestige player_prestige_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_prestige
    ADD CONSTRAINT player_prestige_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: predictions predictions_match_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_match_fk FOREIGN KEY (match_id) REFERENCES public.matches(external_id) ON DELETE CASCADE;


--
-- Name: predictions predictions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.predictions
    ADD CONSTRAINT predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: prize_redemptions prize_redemptions_prize_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prize_redemptions
    ADD CONSTRAINT prize_redemptions_prize_id_fkey FOREIGN KEY (prize_id) REFERENCES public.arena_prizes(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ranked_matches ranked_matches_club_a_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_club_a_id_fkey FOREIGN KEY (club_a_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: ranked_matches ranked_matches_club_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_club_b_id_fkey FOREIGN KEY (club_b_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: ranked_matches ranked_matches_loser_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_loser_club_id_fkey FOREIGN KEY (loser_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;


--
-- Name: ranked_matches ranked_matches_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE SET NULL;


--
-- Name: ranked_matches ranked_matches_winner_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ranked_matches
    ADD CONSTRAINT ranked_matches_winner_club_id_fkey FOREIGN KEY (winner_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;


--
-- Name: rate_limits rate_limits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id);


--
-- Name: referral_codes referral_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_codes
    ADD CONSTRAINT referral_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: referrals referrals_referred_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referred_user_id_fkey FOREIGN KEY (referred_user_id) REFERENCES public.profiles(id);


--
-- Name: referrals referrals_referrer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referrer_id_fkey FOREIGN KEY (referrer_id) REFERENCES public.profiles(id);


--
-- Name: season_club_scores season_club_scores_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_club_scores
    ADD CONSTRAINT season_club_scores_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: season_club_scores season_club_scores_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_club_scores
    ADD CONSTRAINT season_club_scores_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: season_xp season_xp_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_xp
    ADD CONSTRAINT season_xp_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: season_xp season_xp_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.season_xp
    ADD CONSTRAINT season_xp_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: territory_adjacency territory_adjacency_adjacent_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_adjacency
    ADD CONSTRAINT territory_adjacency_adjacent_territory_id_fkey FOREIGN KEY (adjacent_territory_id) REFERENCES public.club_territories(id);


--
-- Name: territory_adjacency territory_adjacency_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_adjacency
    ADD CONSTRAINT territory_adjacency_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.club_territories(id);


--
-- Name: territory_connections territory_connections_territory_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_connections
    ADD CONSTRAINT territory_connections_territory_a_fkey FOREIGN KEY (territory_a) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: territory_connections territory_connections_territory_b_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territory_connections
    ADD CONSTRAINT territory_connections_territory_b_fkey FOREIGN KEY (territory_b) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: unit_encounters unit_encounters_loser_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_encounters
    ADD CONSTRAINT unit_encounters_loser_club_id_fkey FOREIGN KEY (loser_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;


--
-- Name: unit_encounters unit_encounters_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_encounters
    ADD CONSTRAINT unit_encounters_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: unit_encounters unit_encounters_winner_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_encounters
    ADD CONSTRAINT unit_encounters_winner_club_id_fkey FOREIGN KEY (winner_club_id) REFERENCES public.clubs(id) ON DELETE SET NULL;


--
-- Name: unit_movements unit_movements_from_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_movements
    ADD CONSTRAINT unit_movements_from_territory_id_fkey FOREIGN KEY (from_territory_id) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: unit_movements unit_movements_to_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_movements
    ADD CONSTRAINT unit_movements_to_territory_id_fkey FOREIGN KEY (to_territory_id) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: unit_movements unit_movements_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_movements
    ADD CONSTRAINT unit_movements_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.club_units(id) ON DELETE CASCADE;


--
-- Name: unit_orders unit_orders_target_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_orders
    ADD CONSTRAINT unit_orders_target_territory_id_fkey FOREIGN KEY (target_territory_id) REFERENCES public.club_territories(id) ON DELETE CASCADE;


--
-- Name: unit_orders unit_orders_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_orders
    ADD CONSTRAINT unit_orders_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.club_units(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.seasons(id) ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_daily_challenges user_daily_challenges_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_daily_challenges
    ADD CONSTRAINT user_daily_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.daily_challenges(id);


--
-- Name: user_level_rewards user_level_rewards_reward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_level_rewards
    ADD CONSTRAINT user_level_rewards_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.level_rewards(id);


--
-- Name: war_contributions war_contributions_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.war_contributions
    ADD CONSTRAINT war_contributions_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: war_contributions war_contributions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.war_contributions
    ADD CONSTRAINT war_contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: war_contributions war_contributions_war_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.war_contributions
    ADD CONSTRAINT war_contributions_war_id_fkey FOREIGN KEY (war_id) REFERENCES public.club_wars(id) ON DELETE CASCADE;


--
-- Name: weekly_rewards weekly_rewards_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_rewards
    ADD CONSTRAINT weekly_rewards_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_audit_logs Admins can insert audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can insert audit logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: arena_prizes Admins can manage prizes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage prizes" ON public.arena_prizes USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: support_inquiries Admins can update inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update inquiries" ON public.support_inquiries FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: club_join_requests Admins can update join requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update join requests" ON public.club_join_requests FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_join_requests.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: prize_redemptions Admins can update redemptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can update redemptions" ON public.prize_redemptions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: support_inquiries Admins can view all inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all inquiries" ON public.support_inquiries FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: prize_redemptions Admins can view all redemptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view all redemptions" ON public.prize_redemptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: admin_audit_logs Admins can view audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: support_inquiries Anyone can create inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can create inquiries" ON public.support_inquiries FOR INSERT WITH CHECK (true);


--
-- Name: daily_challenges Anyone can view active challenges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active challenges" ON public.daily_challenges FOR SELECT USING ((active = true));


--
-- Name: arena_prizes Anyone can view active prizes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active prizes" ON public.arena_prizes FOR SELECT USING ((active = true));


--
-- Name: club_challenge_templates Anyone can view active templates; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view active templates" ON public.club_challenge_templates FOR SELECT USING ((active = true));


--
-- Name: badges Anyone can view badges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);


--
-- Name: club_weekly_rankings Anyone can view club rankings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view club rankings" ON public.club_weekly_rankings FOR SELECT USING (true);


--
-- Name: club_rewards Anyone can view club rewards; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view club rewards" ON public.club_rewards FOR SELECT USING ((active = true));


--
-- Name: level_rewards Anyone can view level rewards; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view level rewards" ON public.level_rewards FOR SELECT USING (true);


--
-- Name: clubs Anyone can view public clubs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view public clubs" ON public.clubs FOR SELECT USING ((is_public = true));


--
-- Name: weekly_rankings Anyone can view rankings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view rankings" ON public.weekly_rankings FOR SELECT USING (true);


--
-- Name: weekly_rewards Anyone can view weekly rewards; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view weekly rewards" ON public.weekly_rewards FOR SELECT USING ((active = true));


--
-- Name: club_wars Authenticated users can view club wars; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can view club wars" ON public.club_wars FOR SELECT TO authenticated USING (true);


--
-- Name: club_territories Authenticated users can view territories; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Authenticated users can view territories" ON public.club_territories FOR SELECT TO authenticated USING (true);


--
-- Name: club_ban_appeals Banned users can create appeals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Banned users can create appeals" ON public.club_ban_appeals FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM public.club_banned_members
  WHERE ((club_banned_members.club_id = club_ban_appeals.club_id) AND (club_banned_members.user_id = auth.uid())))) AND (NOT (EXISTS ( SELECT 1
   FROM public.club_ban_appeals existing
  WHERE ((existing.club_id = club_ban_appeals.club_id) AND (existing.user_id = auth.uid()) AND (existing.status = 'pending'::text)))))));


--
-- Name: club_banned_members Club admins can ban members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can ban members" ON public.club_banned_members FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_banned_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_challenges Club admins can create challenges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can create challenges" ON public.club_challenges FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_challenges.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_wars Club admins can create wars; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can create wars" ON public.club_wars FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_wars.challenger_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_messages Club admins can delete messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can delete messages" ON public.club_messages FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_messages.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text]))))));


--
-- Name: club_muted_members Club admins can mute members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can mute members" ON public.club_muted_members FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_muted_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text]))))));


--
-- Name: club_messages Club admins can pin messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can pin messages" ON public.club_messages FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_messages.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_banned_members Club admins can unban members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can unban members" ON public.club_banned_members FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_banned_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_muted_members Club admins can unmute members; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can unmute members" ON public.club_muted_members FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_muted_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text]))))));


--
-- Name: club_ban_appeals Club admins can update appeals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can update appeals" ON public.club_ban_appeals FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_ban_appeals.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_muted_members Club admins can update mutes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can update mutes" ON public.club_muted_members FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_muted_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text, 'moderator'::text]))))));


--
-- Name: club_ban_appeals Club admins can view appeals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can view appeals" ON public.club_ban_appeals FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_ban_appeals.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_banned_members Club admins can view bans; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can view bans" ON public.club_banned_members FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_banned_members.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_moderation_logs Club admins can view moderation logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can view moderation logs" ON public.club_moderation_logs FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_moderation_logs.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_join_requests Club admins can view requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club admins can view requests" ON public.club_join_requests FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_join_requests.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_message_reactions Club members can add reactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can add reactions" ON public.club_message_reactions FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM (public.club_messages cm
     JOIN public.club_members cmem ON ((cmem.club_id = cm.club_id)))
  WHERE ((cm.id = club_message_reactions.message_id) AND (cmem.user_id = auth.uid()))))));


--
-- Name: club_polls Club members can create polls; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can create polls" ON public.club_polls FOR INSERT WITH CHECK (((auth.uid() = creator_id) AND (EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_polls.club_id) AND (club_members.user_id = auth.uid()))))));


--
-- Name: club_messages Club members can send messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can send messages" ON public.club_messages FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_messages.club_id) AND (club_members.user_id = auth.uid()))))));


--
-- Name: club_activities Club members can view activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view activities" ON public.club_activities FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_activities.club_id) AND (club_members.user_id = auth.uid())))));


--
-- Name: club_messages Club members can view messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view messages" ON public.club_messages FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_messages.club_id) AND (club_members.user_id = auth.uid())))));


--
-- Name: club_muted_members Club members can view mutes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view mutes" ON public.club_muted_members FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_muted_members.club_id) AND (club_members.user_id = auth.uid())))));


--
-- Name: club_poll_options Club members can view poll options; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view poll options" ON public.club_poll_options FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.club_polls p
     JOIN public.club_members cm ON ((cm.club_id = p.club_id)))
  WHERE ((p.id = club_poll_options.poll_id) AND (cm.user_id = auth.uid())))));


--
-- Name: club_polls Club members can view polls; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view polls" ON public.club_polls FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_polls.club_id) AND (club_members.user_id = auth.uid())))));


--
-- Name: club_message_reactions Club members can view reactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view reactions" ON public.club_message_reactions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.club_messages cm
     JOIN public.club_members cmem ON ((cmem.club_id = cm.club_id)))
  WHERE ((cm.id = club_message_reactions.message_id) AND (cmem.user_id = auth.uid())))));


--
-- Name: club_challenges Club members can view their challenges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view their challenges" ON public.club_challenges FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_challenges.club_id) AND (club_members.user_id = auth.uid())))));


--
-- Name: club_poll_votes Club members can view votes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can view votes" ON public.club_poll_votes FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.club_polls p
     JOIN public.club_members cm ON ((cm.club_id = p.club_id)))
  WHERE ((p.id = club_poll_votes.poll_id) AND (cm.user_id = auth.uid())))));


--
-- Name: club_poll_votes Club members can vote; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Club members can vote" ON public.club_poll_votes FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM (public.club_polls p
     JOIN public.club_members cm ON ((cm.club_id = p.club_id)))
  WHERE ((p.id = club_poll_votes.poll_id) AND (cm.user_id = auth.uid()) AND (p.is_closed = false))))));


--
-- Name: club_wars Involved club admins can update wars; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Involved club admins can update wars" ON public.club_wars FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE (((club_members.club_id = club_wars.challenger_id) OR (club_members.club_id = club_wars.defender_id)) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_challenge_contributions Members can view contributions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Members can view contributions" ON public.club_challenge_contributions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (public.club_challenges cc
     JOIN public.club_members cm ON ((cm.club_id = cc.club_id)))
  WHERE ((cc.id = club_challenge_contributions.challenge_id) AND (cm.user_id = auth.uid())))));


--
-- Name: clubs Members can view their private clubs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Members can view their private clubs" ON public.clubs FOR SELECT USING (((is_public = false) AND (EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = clubs.id) AND (club_members.user_id = auth.uid()))))));


--
-- Name: clubs Only owners can delete clubs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only owners can delete clubs" ON public.clubs FOR DELETE USING ((auth.uid() = owner_id));


--
-- Name: clubs Owners and admins can update clubs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Owners and admins can update clubs" ON public.clubs FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = clubs.id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))));


--
-- Name: club_polls Poll creators and admins can update polls; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Poll creators and admins can update polls" ON public.club_polls FOR UPDATE USING (((auth.uid() = creator_id) OR (EXISTS ( SELECT 1
   FROM public.club_members
  WHERE ((club_members.club_id = club_polls.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['owner'::text, 'admin'::text])))))));


--
-- Name: club_poll_options Poll creators can add options; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Poll creators can add options" ON public.club_poll_options FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.club_polls p
  WHERE ((p.id = club_poll_options.poll_id) AND (p.creator_id = auth.uid())))));


--
-- Name: arena_ledger Service role can insert ledger entries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Service role can insert ledger entries" ON public.arena_ledger FOR INSERT WITH CHECK (true);


--
-- Name: club_activities System can insert activities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert activities" ON public.club_activities FOR INSERT TO service_role WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: club_moderation_logs System can insert moderation logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert moderation logs" ON public.club_moderation_logs FOR INSERT WITH CHECK (true);


--
-- Name: user_notifications System can insert notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert notifications" ON public.user_notifications FOR INSERT WITH CHECK (true);


--
-- Name: club_weekly_rankings System can insert rankings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert rankings" ON public.club_weekly_rankings FOR INSERT TO service_role WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: club_challenge_contributions System can manage contributions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can manage contributions" ON public.club_challenge_contributions TO service_role USING ((auth.role() = 'service_role'::text)) WITH CHECK ((auth.role() = 'service_role'::text));


--
-- Name: club_challenges System can update challenges; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can update challenges" ON public.club_challenges FOR UPDATE USING (true);


--
-- Name: club_weekly_rankings System can update rankings; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can update rankings" ON public.club_weekly_rankings FOR UPDATE TO service_role USING ((auth.role() = 'service_role'::text));


--
-- Name: user_level_rewards Users can claim rewards; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can claim rewards" ON public.user_level_rewards FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: clubs Users can create clubs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create clubs" ON public.clubs FOR INSERT WITH CHECK ((auth.uid() = owner_id));


--
-- Name: club_join_requests Users can create join requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create join requests" ON public.club_join_requests FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: predictions Users can create their own predictions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own predictions" ON public.predictions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: prize_redemptions Users can create their own redemptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create their own redemptions" ON public.prize_redemptions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: club_messages Users can delete their own messages; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete their own messages" ON public.club_messages FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_daily_challenges Users can insert their own challenge progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their own challenge progress" ON public.user_daily_challenges FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_notifications Users can read their notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read their notifications" ON public.user_notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: club_message_reactions Users can remove their own reactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can remove their own reactions" ON public.club_message_reactions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: club_poll_votes Users can remove their votes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can remove their votes" ON public.club_poll_votes FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_notifications Users can update their notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their notifications" ON public.user_notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_daily_challenges Users can update their own challenge progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own challenge progress" ON public.user_daily_challenges FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own notifications" ON public.user_notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: prize_redemptions Users can view own redemptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own redemptions" ON public.prize_redemptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: arena_transactions Users can view own transactions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own transactions" ON public.arena_transactions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_level_rewards Users can view their claimed rewards; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their claimed rewards" ON public.user_level_rewards FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: club_ban_appeals Users can view their own appeals; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own appeals" ON public.club_ban_appeals FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_daily_challenges Users can view their own challenge progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own challenge progress" ON public.user_daily_challenges FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: support_inquiries Users can view their own inquiries; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own inquiries" ON public.support_inquiries FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: arena_ledger Users can view their own ledger; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own ledger" ON public.arena_ledger FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own notifications" ON public.user_notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: predictions Users can view their own predictions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own predictions" ON public.predictions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: prize_redemptions Users can view their own redemptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own redemptions" ON public.prize_redemptions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: club_join_requests Users can view their own requests; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own requests" ON public.club_join_requests FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: admin_audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: alliance_invites; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.alliance_invites ENABLE ROW LEVEL SECURITY;

--
-- Name: alliance_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.alliance_members ENABLE ROW LEVEL SECURITY;

--
-- Name: alliances; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.alliances ENABLE ROW LEVEL SECURITY;

--
-- Name: arena_ledger; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.arena_ledger ENABLE ROW LEVEL SECURITY;

--
-- Name: arena_prizes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.arena_prizes ENABLE ROW LEVEL SECURITY;

--
-- Name: arena_transactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.arena_transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: army_group_units; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.army_group_units ENABLE ROW LEVEL SECURITY;

--
-- Name: army_groups; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.army_groups ENABLE ROW LEVEL SECURITY;

--
-- Name: badges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

--
-- Name: battle_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.battle_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: boss_damage; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.boss_damage ENABLE ROW LEVEL SECURITY;

--
-- Name: club_activities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_activities ENABLE ROW LEVEL SECURITY;

--
-- Name: club_ban_appeals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_ban_appeals ENABLE ROW LEVEL SECURITY;

--
-- Name: club_banned_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_banned_members ENABLE ROW LEVEL SECURITY;

--
-- Name: club_challenge_contributions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_challenge_contributions ENABLE ROW LEVEL SECURITY;

--
-- Name: club_challenge_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_challenge_templates ENABLE ROW LEVEL SECURITY;

--
-- Name: club_challenges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: club_join_requests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_join_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: club_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

--
-- Name: club_members club_members_join_public; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_members_join_public ON public.club_members FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM public.clubs
  WHERE ((clubs.id = club_members.club_id) AND (clubs.is_public = true))))));


--
-- Name: club_members club_members_leave; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_members_leave ON public.club_members FOR DELETE USING (((auth.uid() = user_id) AND (role <> 'owner'::text)));


--
-- Name: club_members club_members_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_members_select_own ON public.club_members FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: club_message_reactions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_message_reactions ENABLE ROW LEVEL SECURITY;

--
-- Name: club_messages; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;

--
-- Name: club_moderation_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_moderation_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: club_muted_members; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_muted_members ENABLE ROW LEVEL SECURITY;

--
-- Name: club_poll_options; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_poll_options ENABLE ROW LEVEL SECURITY;

--
-- Name: club_poll_votes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_poll_votes ENABLE ROW LEVEL SECURITY;

--
-- Name: club_polls; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_polls ENABLE ROW LEVEL SECURITY;

--
-- Name: club_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: club_rivalries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_rivalries ENABLE ROW LEVEL SECURITY;

--
-- Name: club_season_rankings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_season_rankings ENABLE ROW LEVEL SECURITY;

--
-- Name: club_season_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_season_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: club_season_stats; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_season_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: club_season_stats club_season_stats_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_season_stats_manage_service ON public.club_season_stats TO service_role USING (true) WITH CHECK (true);


--
-- Name: club_season_stats club_season_stats_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_season_stats_select_all ON public.club_season_stats FOR SELECT TO authenticated USING (true);


--
-- Name: club_seasons; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_seasons ENABLE ROW LEVEL SECURITY;

--
-- Name: club_territories; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_territories ENABLE ROW LEVEL SECURITY;

--
-- Name: club_units; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_units ENABLE ROW LEVEL SECURITY;

--
-- Name: club_war_scores; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_war_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: club_war_scores club_war_scores_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_war_scores_manage_service ON public.club_war_scores TO service_role USING (true) WITH CHECK (true);


--
-- Name: club_war_scores club_war_scores_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY club_war_scores_select_all ON public.club_war_scores FOR SELECT TO authenticated USING (true);


--
-- Name: club_wars; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_wars ENABLE ROW LEVEL SECURITY;

--
-- Name: club_weekly_rankings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.club_weekly_rankings ENABLE ROW LEVEL SECURITY;

--
-- Name: clubs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

--
-- Name: cosmetics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.cosmetics ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_challenges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: guild_tournament_entries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.guild_tournament_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: guild_tournaments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.guild_tournaments ENABLE ROW LEVEL SECURITY;

--
-- Name: season_hall_of_fame hall_of_fame_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY hall_of_fame_manage_service ON public.season_hall_of_fame TO service_role USING (true) WITH CHECK (true);


--
-- Name: season_hall_of_fame hall_of_fame_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY hall_of_fame_select_all ON public.season_hall_of_fame FOR SELECT TO authenticated USING (true);


--
-- Name: level_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.level_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: matches; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

--
-- Name: matches matches_insert_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY matches_insert_service ON public.matches FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: matches matches_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY matches_select_all ON public.matches FOR SELECT TO authenticated USING (true);


--
-- Name: matches matches_update_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY matches_update_service ON public.matches FOR UPDATE TO service_role USING (true) WITH CHECK (true);


--
-- Name: player_cosmetics; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.player_cosmetics ENABLE ROW LEVEL SECURITY;

--
-- Name: player_prestige; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.player_prestige ENABLE ROW LEVEL SECURITY;

--
-- Name: predictions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

--
-- Name: prize_redemptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.prize_redemptions ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: ranked_matches; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ranked_matches ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limits; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limits rate_limits_service_only; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rate_limits_service_only ON public.rate_limits TO service_role USING (true) WITH CHECK (true);


--
-- Name: referral_codes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: referrals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

--
-- Name: season_club_scores; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.season_club_scores ENABLE ROW LEVEL SECURITY;

--
-- Name: season_hall_of_fame; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.season_hall_of_fame ENABLE ROW LEVEL SECURITY;

--
-- Name: season_xp; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.season_xp ENABLE ROW LEVEL SECURITY;

--
-- Name: season_xp season_xp_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY season_xp_manage_service ON public.season_xp TO service_role USING (true) WITH CHECK (true);


--
-- Name: season_xp season_xp_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY season_xp_select_own ON public.season_xp FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: seasons; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

--
-- Name: seasons seasons_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY seasons_manage_service ON public.seasons TO service_role USING (true) WITH CHECK (true);


--
-- Name: seasons seasons_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY seasons_select_all ON public.seasons FOR SELECT TO authenticated USING (true);


--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions subscriptions_delete_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscriptions_delete_service ON public.subscriptions FOR DELETE TO service_role USING (true);


--
-- Name: subscriptions subscriptions_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscriptions_insert_own ON public.subscriptions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: subscriptions subscriptions_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscriptions_select_own ON public.subscriptions FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: subscriptions subscriptions_update_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY subscriptions_update_service ON public.subscriptions FOR UPDATE TO service_role USING (true) WITH CHECK (true);


--
-- Name: support_inquiries; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.support_inquiries ENABLE ROW LEVEL SECURITY;

--
-- Name: territory_adjacency; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.territory_adjacency ENABLE ROW LEVEL SECURITY;

--
-- Name: territory_connections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.territory_connections ENABLE ROW LEVEL SECURITY;

--
-- Name: territory_paths; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.territory_paths ENABLE ROW LEVEL SECURITY;

--
-- Name: unit_encounters; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.unit_encounters ENABLE ROW LEVEL SECURITY;

--
-- Name: unit_movements; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.unit_movements ENABLE ROW LEVEL SECURITY;

--
-- Name: unit_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.unit_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: user_badges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

--
-- Name: user_badges user_badges_delete_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_badges_delete_service ON public.user_badges FOR DELETE TO service_role USING (true);


--
-- Name: user_badges user_badges_insert_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_badges_insert_service ON public.user_badges FOR INSERT TO service_role WITH CHECK (true);


--
-- Name: user_badges user_badges_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_badges_select_all ON public.user_badges FOR SELECT TO authenticated USING (true);


--
-- Name: user_daily_challenges; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_daily_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: user_level_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_level_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: user_notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_season_tiers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_season_tiers ENABLE ROW LEVEL SECURITY;

--
-- Name: user_season_tiers user_season_tiers_manage_service; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_season_tiers_manage_service ON public.user_season_tiers TO service_role USING (true) WITH CHECK (true);


--
-- Name: user_season_tiers user_season_tiers_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY user_season_tiers_select_own ON public.user_season_tiers FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: v_matches; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.v_matches ENABLE ROW LEVEL SECURITY;

--
-- Name: war_contributions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.war_contributions ENABLE ROW LEVEL SECURITY;

--
-- Name: weekly_rankings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.weekly_rankings ENABLE ROW LEVEL SECURITY;

--
-- Name: weekly_rewards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.weekly_rewards ENABLE ROW LEVEL SECURITY;

--
-- Name: world_boss; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.world_boss ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: supabase_realtime_messages_publication; Type: PUBLICATION; Schema: -; Owner: supabase_admin
--

CREATE PUBLICATION supabase_realtime_messages_publication WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime_messages_publication OWNER TO supabase_admin;

--
-- Name: supabase_realtime club_territories; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.club_territories;


--
-- Name: supabase_realtime club_wars; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.club_wars;


--
-- Name: supabase_realtime clubs; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.clubs;


--
-- Name: supabase_realtime predictions; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.predictions;


--
-- Name: supabase_realtime season_xp; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.season_xp;


--
-- Name: supabase_realtime user_notifications; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.user_notifications;


--
-- Name: supabase_realtime war_contributions; Type: PUBLICATION TABLE; Schema: public; Owner: postgres
--

ALTER PUBLICATION supabase_realtime ADD TABLE ONLY public.war_contributions;


--
-- Name: supabase_realtime_messages_publication messages; Type: PUBLICATION TABLE; Schema: realtime; Owner: supabase_admin
--

ALTER PUBLICATION supabase_realtime_messages_publication ADD TABLE ONLY realtime.messages;


--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA cron; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA cron TO postgres WITH GRANT OPTION;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA net; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA net TO supabase_functions_admin;
GRANT USAGE ON SCHEMA net TO postgres;
GRANT USAGE ON SCHEMA net TO anon;
GRANT USAGE ON SCHEMA net TO authenticated;
GRANT USAGE ON SCHEMA net TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.alter_job(job_id bigint, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION job_cache_invalidate(); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.job_cache_invalidate() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule(job_name text, schedule text, command text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule(job_name text, schedule text, command text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.schedule_in_database(job_name text, schedule text, command text, database text, username text, active boolean) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_id bigint); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_id bigint) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION unschedule(job_name text); Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON FUNCTION cron.unschedule(job_name text) TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: FUNCTION accept_alliance_invite(p_invite_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.accept_alliance_invite(p_invite_id uuid) TO anon;
GRANT ALL ON FUNCTION public.accept_alliance_invite(p_invite_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.accept_alliance_invite(p_invite_id uuid) TO service_role;


--
-- Name: FUNCTION add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO anon;
GRANT ALL ON FUNCTION public.add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.add_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO service_role;


--
-- Name: FUNCTION add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO anon;
GRANT ALL ON FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO authenticated;
GRANT ALL ON FUNCTION public.add_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO service_role;


--
-- Name: FUNCTION add_club_xp(p_user_id uuid, p_xp integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_club_xp(p_user_id uuid, p_xp integer) TO anon;
GRANT ALL ON FUNCTION public.add_club_xp(p_user_id uuid, p_xp integer) TO authenticated;
GRANT ALL ON FUNCTION public.add_club_xp(p_user_id uuid, p_xp integer) TO service_role;


--
-- Name: FUNCTION add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer) TO anon;
GRANT ALL ON FUNCTION public.add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer) TO authenticated;
GRANT ALL ON FUNCTION public.add_war_contribution(p_war uuid, p_user uuid, p_club uuid, p_xp integer) TO service_role;


--
-- Name: FUNCTION add_xp(p_user_id uuid, p_amount integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_xp(p_user_id uuid, p_amount integer) TO anon;
GRANT ALL ON FUNCTION public.add_xp(p_user_id uuid, p_amount integer) TO authenticated;
GRANT ALL ON FUNCTION public.add_xp(p_user_id uuid, p_amount integer) TO service_role;


--
-- Name: FUNCTION apply_bonus(base_xp integer, territory_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_bonus(base_xp integer, territory_id uuid) TO anon;
GRANT ALL ON FUNCTION public.apply_bonus(base_xp integer, territory_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.apply_bonus(base_xp integer, territory_id uuid) TO service_role;


--
-- Name: FUNCTION apply_boss_damage(p_club_id uuid, p_damage integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_boss_damage(p_club_id uuid, p_damage integer) TO anon;
GRANT ALL ON FUNCTION public.apply_boss_damage(p_club_id uuid, p_damage integer) TO authenticated;
GRANT ALL ON FUNCTION public.apply_boss_damage(p_club_id uuid, p_damage integer) TO service_role;


--
-- Name: FUNCTION apply_club_promotions(p_season_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_club_promotions(p_season_id uuid) TO anon;
GRANT ALL ON FUNCTION public.apply_club_promotions(p_season_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.apply_club_promotions(p_season_id uuid) TO service_role;


--
-- Name: FUNCTION apply_club_upkeep(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_club_upkeep() TO anon;
GRANT ALL ON FUNCTION public.apply_club_upkeep() TO authenticated;
GRANT ALL ON FUNCTION public.apply_club_upkeep() TO service_role;


--
-- Name: FUNCTION apply_club_xp_from_prediction(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_club_xp_from_prediction() TO anon;
GRANT ALL ON FUNCTION public.apply_club_xp_from_prediction() TO authenticated;
GRANT ALL ON FUNCTION public.apply_club_xp_from_prediction() TO service_role;


--
-- Name: FUNCTION apply_influence_capture_tick(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_influence_capture_tick() TO anon;
GRANT ALL ON FUNCTION public.apply_influence_capture_tick() TO authenticated;
GRANT ALL ON FUNCTION public.apply_influence_capture_tick() TO service_role;


--
-- Name: FUNCTION apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.apply_ranked_result(p_winner_club_id uuid, p_loser_club_id uuid) TO service_role;


--
-- Name: FUNCTION apply_unit_war_support(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_unit_war_support() TO anon;
GRANT ALL ON FUNCTION public.apply_unit_war_support() TO authenticated;
GRANT ALL ON FUNCTION public.apply_unit_war_support() TO service_role;


--
-- Name: FUNCTION apply_war_xp(p_club_id uuid, p_xp integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.apply_war_xp(p_club_id uuid, p_xp integer) TO anon;
GRANT ALL ON FUNCTION public.apply_war_xp(p_club_id uuid, p_xp integer) TO authenticated;
GRANT ALL ON FUNCTION public.apply_war_xp(p_club_id uuid, p_xp integer) TO service_role;


--
-- Name: FUNCTION approve_join_request(p_request_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.approve_join_request(p_request_id uuid) TO anon;
GRANT ALL ON FUNCTION public.approve_join_request(p_request_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.approve_join_request(p_request_id uuid) TO service_role;


--
-- Name: FUNCTION auth_role_test(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auth_role_test() TO anon;
GRANT ALL ON FUNCTION public.auth_role_test() TO authenticated;
GRANT ALL ON FUNCTION public.auth_role_test() TO service_role;


--
-- Name: FUNCTION auto_matchmake_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_matchmake_wars() TO anon;
GRANT ALL ON FUNCTION public.auto_matchmake_wars() TO authenticated;
GRANT ALL ON FUNCTION public.auto_matchmake_wars() TO service_role;


--
-- Name: FUNCTION auto_matchmaking(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.auto_matchmaking() TO anon;
GRANT ALL ON FUNCTION public.auto_matchmaking() TO authenticated;
GRANT ALL ON FUNCTION public.auto_matchmaking() TO service_role;


--
-- Name: FUNCTION award_prediction_xp(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.award_prediction_xp() TO anon;
GRANT ALL ON FUNCTION public.award_prediction_xp() TO authenticated;
GRANT ALL ON FUNCTION public.award_prediction_xp() TO service_role;


--
-- Name: FUNCTION can_attack(p_attacker_club_id uuid, p_defender_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_attack(p_attacker_club_id uuid, p_defender_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_attack(p_attacker_club_id uuid, p_defender_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_attack(p_attacker_club_id uuid, p_defender_club_id uuid) TO service_role;


--
-- Name: FUNCTION can_invade_territory(p_club_id uuid, p_target_territory uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_invade_territory(p_club_id uuid, p_target_territory uuid) TO anon;
GRANT ALL ON FUNCTION public.can_invade_territory(p_club_id uuid, p_target_territory uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_invade_territory(p_club_id uuid, p_target_territory uuid) TO service_role;


--
-- Name: FUNCTION capture_territory(p_club_id uuid, p_territory_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.capture_territory(p_club_id uuid, p_territory_id uuid) TO anon;
GRANT ALL ON FUNCTION public.capture_territory(p_club_id uuid, p_territory_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.capture_territory(p_club_id uuid, p_territory_id uuid) TO service_role;


--
-- Name: FUNCTION check_and_resolve_war(p_war_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_and_resolve_war(p_war_id uuid) TO anon;
GRANT ALL ON FUNCTION public.check_and_resolve_war(p_war_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.check_and_resolve_war(p_war_id uuid) TO service_role;


--
-- Name: FUNCTION check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text) TO anon;
GRANT ALL ON FUNCTION public.check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text) TO authenticated;
GRANT ALL ON FUNCTION public.check_and_reward_tier_upgrade(p_user_id uuid, p_season_id uuid, p_new_tier text) TO service_role;


--
-- Name: FUNCTION check_auto_battle(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_auto_battle() TO anon;
GRANT ALL ON FUNCTION public.check_auto_battle() TO authenticated;
GRANT ALL ON FUNCTION public.check_auto_battle() TO service_role;


--
-- Name: FUNCTION check_rate_limit(p_action_type text, p_max_per_hour integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_rate_limit(p_action_type text, p_max_per_hour integer) TO anon;
GRANT ALL ON FUNCTION public.check_rate_limit(p_action_type text, p_max_per_hour integer) TO authenticated;
GRANT ALL ON FUNCTION public.check_rate_limit(p_action_type text, p_max_per_hour integer) TO service_role;


--
-- Name: FUNCTION check_war_completion(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_war_completion() TO anon;
GRANT ALL ON FUNCTION public.check_war_completion() TO authenticated;
GRANT ALL ON FUNCTION public.check_war_completion() TO service_role;


--
-- Name: FUNCTION claim_club_challenge_reward(p_challenge_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid) TO anon;
GRANT ALL ON FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.claim_club_challenge_reward(p_challenge_id uuid) TO service_role;


--
-- Name: FUNCTION claim_club_season_reward(p_ranking_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.claim_club_season_reward(p_ranking_id uuid) TO anon;
GRANT ALL ON FUNCTION public.claim_club_season_reward(p_ranking_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.claim_club_season_reward(p_ranking_id uuid) TO service_role;


--
-- Name: FUNCTION cleanup_rate_limits(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_rate_limits() TO anon;
GRANT ALL ON FUNCTION public.cleanup_rate_limits() TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_rate_limits() TO service_role;


--
-- Name: FUNCTION complete_daily_challenge_reward(p_xp_reward integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer) TO anon;
GRANT ALL ON FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer) TO authenticated;
GRANT ALL ON FUNCTION public.complete_daily_challenge_reward(p_xp_reward integer) TO service_role;


--
-- Name: FUNCTION complete_ready_unit_movements(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.complete_ready_unit_movements() TO anon;
GRANT ALL ON FUNCTION public.complete_ready_unit_movements() TO authenticated;
GRANT ALL ON FUNCTION public.complete_ready_unit_movements() TO service_role;


--
-- Name: FUNCTION create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid) TO anon;
GRANT ALL ON FUNCTION public.create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.create_alliance(p_name text, p_description text, p_owner_club_id uuid, p_season_id uuid) TO service_role;


--
-- Name: FUNCTION create_auto_war(p_club_id uuid, p_duration_hours integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_auto_war(p_club_id uuid, p_duration_hours integer) TO anon;
GRANT ALL ON FUNCTION public.create_auto_war(p_club_id uuid, p_duration_hours integer) TO authenticated;
GRANT ALL ON FUNCTION public.create_auto_war(p_club_id uuid, p_duration_hours integer) TO service_role;


--
-- Name: FUNCTION create_club_war(p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_club_war(p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.create_club_war(p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.create_club_war(p_club_id uuid) TO service_role;


--
-- Name: FUNCTION create_join_request(p_club_id uuid, p_message text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_join_request(p_club_id uuid, p_message text) TO anon;
GRANT ALL ON FUNCTION public.create_join_request(p_club_id uuid, p_message text) TO authenticated;
GRANT ALL ON FUNCTION public.create_join_request(p_club_id uuid, p_message text) TO service_role;


--
-- Name: FUNCTION create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) TO anon;
GRANT ALL ON FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) TO authenticated;
GRANT ALL ON FUNCTION public.create_prediction_secure(p_match_id text, p_selected_team text, p_odds numeric, p_stake_amount integer) TO service_role;


--
-- Name: TABLE club_wars; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_wars TO anon;
GRANT ALL ON TABLE public.club_wars TO authenticated;
GRANT ALL ON TABLE public.club_wars TO service_role;


--
-- Name: FUNCTION create_war(p_club uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_war(p_club uuid) TO anon;
GRANT ALL ON FUNCTION public.create_war(p_club uuid) TO authenticated;
GRANT ALL ON FUNCTION public.create_war(p_club uuid) TO service_role;


--
-- Name: FUNCTION decline_alliance_invite(p_invite_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.decline_alliance_invite(p_invite_id uuid) TO anon;
GRANT ALL ON FUNCTION public.decline_alliance_invite(p_invite_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.decline_alliance_invite(p_invite_id uuid) TO service_role;


--
-- Name: FUNCTION dispatch_next_unit_orders(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.dispatch_next_unit_orders() TO anon;
GRANT ALL ON FUNCTION public.dispatch_next_unit_orders() TO authenticated;
GRANT ALL ON FUNCTION public.dispatch_next_unit_orders() TO service_role;


--
-- Name: FUNCTION end_active_season_and_distribute_rewards(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_active_season_and_distribute_rewards() TO anon;
GRANT ALL ON FUNCTION public.end_active_season_and_distribute_rewards() TO authenticated;
GRANT ALL ON FUNCTION public.end_active_season_and_distribute_rewards() TO service_role;


--
-- Name: FUNCTION end_club_season(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_club_season() TO anon;
GRANT ALL ON FUNCTION public.end_club_season() TO authenticated;
GRANT ALL ON FUNCTION public.end_club_season() TO service_role;


--
-- Name: FUNCTION end_current_season(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_current_season() TO anon;
GRANT ALL ON FUNCTION public.end_current_season() TO authenticated;
GRANT ALL ON FUNCTION public.end_current_season() TO service_role;


--
-- Name: FUNCTION end_expired_club_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_expired_club_wars() TO anon;
GRANT ALL ON FUNCTION public.end_expired_club_wars() TO authenticated;
GRANT ALL ON FUNCTION public.end_expired_club_wars() TO service_role;


--
-- Name: FUNCTION end_expired_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_expired_wars() TO anon;
GRANT ALL ON FUNCTION public.end_expired_wars() TO authenticated;
GRANT ALL ON FUNCTION public.end_expired_wars() TO service_role;


--
-- Name: FUNCTION end_season(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.end_season() TO anon;
GRANT ALL ON FUNCTION public.end_season() TO authenticated;
GRANT ALL ON FUNCTION public.end_season() TO service_role;


--
-- Name: FUNCTION ensure_owner_membership(p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.ensure_owner_membership(p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.ensure_owner_membership(p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.ensure_owner_membership(p_club_id uuid) TO service_role;


--
-- Name: FUNCTION find_opponent(p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_opponent(p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.find_opponent(p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.find_opponent(p_club_id uuid) TO service_role;


--
-- Name: FUNCTION find_war_opponent(p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.find_war_opponent(p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.find_war_opponent(p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.find_war_opponent(p_club_id uuid) TO service_role;


--
-- Name: FUNCTION finish_active_club_season(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.finish_active_club_season() TO anon;
GRANT ALL ON FUNCTION public.finish_active_club_season() TO authenticated;
GRANT ALL ON FUNCTION public.finish_active_club_season() TO service_role;


--
-- Name: FUNCTION finish_expired_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.finish_expired_wars() TO anon;
GRANT ALL ON FUNCTION public.finish_expired_wars() TO authenticated;
GRANT ALL ON FUNCTION public.finish_expired_wars() TO service_role;


--
-- Name: FUNCTION generate_referral_code(p_user uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_referral_code(p_user uuid) TO anon;
GRANT ALL ON FUNCTION public.generate_referral_code(p_user uuid) TO authenticated;
GRANT ALL ON FUNCTION public.generate_referral_code(p_user uuid) TO service_role;


--
-- Name: FUNCTION generate_weekly_club_rankings(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_weekly_club_rankings() TO anon;
GRANT ALL ON FUNCTION public.generate_weekly_club_rankings() TO authenticated;
GRANT ALL ON FUNCTION public.generate_weekly_club_rankings() TO service_role;


--
-- Name: FUNCTION get_allied_support_bonus(p_territory_id uuid, p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_allied_support_bonus(p_territory_id uuid, p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_allied_support_bonus(p_territory_id uuid, p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_allied_support_bonus(p_territory_id uuid, p_club_id uuid) TO service_role;


--
-- Name: FUNCTION get_arena_balance(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_arena_balance() TO anon;
GRANT ALL ON FUNCTION public.get_arena_balance() TO authenticated;
GRANT ALL ON FUNCTION public.get_arena_balance() TO service_role;


--
-- Name: FUNCTION get_attackable_territories(p_club uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_attackable_territories(p_club uuid) TO anon;
GRANT ALL ON FUNCTION public.get_attackable_territories(p_club uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_attackable_territories(p_club uuid) TO service_role;


--
-- Name: FUNCTION get_club_detail(p_slug text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_club_detail(p_slug text) TO anon;
GRANT ALL ON FUNCTION public.get_club_detail(p_slug text) TO authenticated;
GRANT ALL ON FUNCTION public.get_club_detail(p_slug text) TO service_role;


--
-- Name: FUNCTION get_club_leaderboard(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_club_leaderboard() TO anon;
GRANT ALL ON FUNCTION public.get_club_leaderboard() TO authenticated;
GRANT ALL ON FUNCTION public.get_club_leaderboard() TO service_role;


--
-- Name: FUNCTION get_dashboard_data(p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_dashboard_data(p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_dashboard_data(p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_dashboard_data(p_user_id uuid) TO service_role;


--
-- Name: FUNCTION get_path(start_id uuid, end_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_path(start_id uuid, end_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_path(start_id uuid, end_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_path(start_id uuid, end_id uuid) TO service_role;


--
-- Name: FUNCTION get_player_leaderboard(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_player_leaderboard() TO anon;
GRANT ALL ON FUNCTION public.get_player_leaderboard() TO authenticated;
GRANT ALL ON FUNCTION public.get_player_leaderboard() TO service_role;


--
-- Name: FUNCTION get_player_level(p_xp integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_player_level(p_xp integer) TO anon;
GRANT ALL ON FUNCTION public.get_player_level(p_xp integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_player_level(p_xp integer) TO service_role;


--
-- Name: FUNCTION get_season_leaderboard(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_season_leaderboard() TO anon;
GRANT ALL ON FUNCTION public.get_season_leaderboard() TO authenticated;
GRANT ALL ON FUNCTION public.get_season_leaderboard() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION has_role(_user_id uuid, _role public.app_role); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO anon;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO authenticated;
GRANT ALL ON FUNCTION public.has_role(_user_id uuid, _role public.app_role) TO service_role;


--
-- Name: FUNCTION increment_club_war_xp(p_club_id uuid, p_xp integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.increment_club_war_xp(p_club_id uuid, p_xp integer) TO anon;
GRANT ALL ON FUNCTION public.increment_club_war_xp(p_club_id uuid, p_xp integer) TO authenticated;
GRANT ALL ON FUNCTION public.increment_club_war_xp(p_club_id uuid, p_xp integer) TO service_role;


--
-- Name: FUNCTION is_user_banned(p_club_id uuid, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_user_banned(p_club_id uuid, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION is_user_muted(p_club_id uuid, p_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_user_muted(p_club_id uuid, p_user_id uuid) TO service_role;


--
-- Name: FUNCTION move_unit(p_unit_id uuid, p_to_territory_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.move_unit(p_unit_id uuid, p_to_territory_id uuid) TO anon;
GRANT ALL ON FUNCTION public.move_unit(p_unit_id uuid, p_to_territory_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.move_unit(p_unit_id uuid, p_to_territory_id uuid) TO service_role;


--
-- Name: FUNCTION process_unit_movement_tick(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.process_unit_movement_tick() TO anon;
GRANT ALL ON FUNCTION public.process_unit_movement_tick() TO authenticated;
GRANT ALL ON FUNCTION public.process_unit_movement_tick() TO service_role;


--
-- Name: FUNCTION queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer) TO anon;
GRANT ALL ON FUNCTION public.queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer) TO authenticated;
GRANT ALL ON FUNCTION public.queue_unit_order(p_unit_id uuid, p_target_territory_id uuid, p_position integer) TO service_role;


--
-- Name: FUNCTION recalculate_club_tier(p_season_id uuid, p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.recalculate_club_tier(p_season_id uuid, p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.recalculate_club_tier(p_season_id uuid, p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.recalculate_club_tier(p_season_id uuid, p_club_id uuid) TO service_role;


--
-- Name: FUNCTION redeem_prize(p_prize_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.redeem_prize(p_prize_id integer) TO anon;
GRANT ALL ON FUNCTION public.redeem_prize(p_prize_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.redeem_prize(p_prize_id integer) TO service_role;


--
-- Name: FUNCTION redeem_prize_secure(p_prize_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.redeem_prize_secure(p_prize_id integer) TO anon;
GRANT ALL ON FUNCTION public.redeem_prize_secure(p_prize_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.redeem_prize_secure(p_prize_id integer) TO service_role;


--
-- Name: FUNCTION resolve_match(p_match_id text, p_winning_team text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_match(p_match_id text, p_winning_team text) TO anon;
GRANT ALL ON FUNCTION public.resolve_match(p_match_id text, p_winning_team text) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_match(p_match_id text, p_winning_team text) TO service_role;


--
-- Name: FUNCTION resolve_prediction(p_prediction_id uuid, p_won boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) TO anon;
GRANT ALL ON FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_prediction(p_prediction_id uuid, p_won boolean) TO service_role;


--
-- Name: FUNCTION resolve_territory_control(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_territory_control() TO anon;
GRANT ALL ON FUNCTION public.resolve_territory_control() TO authenticated;
GRANT ALL ON FUNCTION public.resolve_territory_control() TO service_role;


--
-- Name: FUNCTION resolve_territory_war(p_war uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_territory_war(p_war uuid) TO anon;
GRANT ALL ON FUNCTION public.resolve_territory_war(p_war uuid) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_territory_war(p_war uuid) TO service_role;


--
-- Name: FUNCTION resolve_unit_battle(p_territory uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_unit_battle(p_territory uuid) TO anon;
GRANT ALL ON FUNCTION public.resolve_unit_battle(p_territory uuid) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_unit_battle(p_territory uuid) TO service_role;


--
-- Name: FUNCTION resolve_unit_collisions(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_unit_collisions() TO anon;
GRANT ALL ON FUNCTION public.resolve_unit_collisions() TO authenticated;
GRANT ALL ON FUNCTION public.resolve_unit_collisions() TO service_role;


--
-- Name: FUNCTION resolve_unit_encounters(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_unit_encounters() TO anon;
GRANT ALL ON FUNCTION public.resolve_unit_encounters() TO authenticated;
GRANT ALL ON FUNCTION public.resolve_unit_encounters() TO service_role;


--
-- Name: FUNCTION resolve_war(p_war_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_war(p_war_id uuid) TO anon;
GRANT ALL ON FUNCTION public.resolve_war(p_war_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_war(p_war_id uuid) TO service_role;


--
-- Name: FUNCTION resolve_war_capture(p_war_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_war_capture(p_war_id uuid) TO anon;
GRANT ALL ON FUNCTION public.resolve_war_capture(p_war_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.resolve_war_capture(p_war_id uuid) TO service_role;


--
-- Name: FUNCTION resolve_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.resolve_wars() TO anon;
GRANT ALL ON FUNCTION public.resolve_wars() TO authenticated;
GRANT ALL ON FUNCTION public.resolve_wars() TO service_role;


--
-- Name: FUNCTION reward_war_winner(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.reward_war_winner() TO anon;
GRANT ALL ON FUNCTION public.reward_war_winner() TO authenticated;
GRANT ALL ON FUNCTION public.reward_war_winner() TO service_role;


--
-- Name: FUNCTION reward_war_winner_with_territory(p_winner_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.reward_war_winner_with_territory(p_winner_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.reward_war_winner_with_territory(p_winner_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.reward_war_winner_with_territory(p_winner_club_id uuid) TO service_role;


--
-- Name: FUNCTION rls_auto_enable(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.rls_auto_enable() TO anon;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO authenticated;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;


--
-- Name: FUNCTION run_all_battle_ticks(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.run_all_battle_ticks() TO anon;
GRANT ALL ON FUNCTION public.run_all_battle_ticks() TO authenticated;
GRANT ALL ON FUNCTION public.run_all_battle_ticks() TO service_role;


--
-- Name: FUNCTION run_military_ai(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.run_military_ai() TO anon;
GRANT ALL ON FUNCTION public.run_military_ai() TO authenticated;
GRANT ALL ON FUNCTION public.run_military_ai() TO service_role;


--
-- Name: FUNCTION run_war_ai_turn(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.run_war_ai_turn() TO anon;
GRANT ALL ON FUNCTION public.run_war_ai_turn() TO authenticated;
GRANT ALL ON FUNCTION public.run_war_ai_turn() TO service_role;


--
-- Name: FUNCTION send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.send_alliance_invite(p_alliance_id uuid, p_club_id uuid, p_invited_by_club_id uuid) TO service_role;


--
-- Name: FUNCTION smart_matchmake_ranked_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.smart_matchmake_ranked_wars() TO anon;
GRANT ALL ON FUNCTION public.smart_matchmake_ranked_wars() TO authenticated;
GRANT ALL ON FUNCTION public.smart_matchmake_ranked_wars() TO service_role;


--
-- Name: FUNCTION smart_matchmake_wars(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.smart_matchmake_wars() TO anon;
GRANT ALL ON FUNCTION public.smart_matchmake_wars() TO authenticated;
GRANT ALL ON FUNCTION public.smart_matchmake_wars() TO service_role;


--
-- Name: FUNCTION spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO anon;
GRANT ALL ON FUNCTION public.spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.spend_arena_balance(p_amount integer, p_transaction_type text, p_reference_id uuid, p_metadata jsonb) TO service_role;


--
-- Name: FUNCTION spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO anon;
GRANT ALL ON FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO authenticated;
GRANT ALL ON FUNCTION public.spend_arena_secure(p_amount bigint, p_source public.arena_source, p_description text, p_reference_id text) TO service_role;


--
-- Name: FUNCTION start_club_challenge(p_club_id uuid, p_template_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_club_challenge(p_club_id uuid, p_template_id uuid) TO anon;
GRANT ALL ON FUNCTION public.start_club_challenge(p_club_id uuid, p_template_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.start_club_challenge(p_club_id uuid, p_template_id uuid) TO service_role;


--
-- Name: FUNCTION start_club_season(p_name text, p_duration_days integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_club_season(p_name text, p_duration_days integer) TO anon;
GRANT ALL ON FUNCTION public.start_club_season(p_name text, p_duration_days integer) TO authenticated;
GRANT ALL ON FUNCTION public.start_club_season(p_name text, p_duration_days integer) TO service_role;


--
-- Name: FUNCTION start_club_war(p_club_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_club_war(p_club_id uuid) TO anon;
GRANT ALL ON FUNCTION public.start_club_war(p_club_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.start_club_war(p_club_id uuid) TO service_role;


--
-- Name: FUNCTION start_new_season(p_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_new_season(p_name text) TO anon;
GRANT ALL ON FUNCTION public.start_new_season(p_name text) TO authenticated;
GRANT ALL ON FUNCTION public.start_new_season(p_name text) TO service_role;


--
-- Name: FUNCTION start_new_season(p_name text, p_duration_days integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_new_season(p_name text, p_duration_days integer) TO anon;
GRANT ALL ON FUNCTION public.start_new_season(p_name text, p_duration_days integer) TO authenticated;
GRANT ALL ON FUNCTION public.start_new_season(p_name text, p_duration_days integer) TO service_role;


--
-- Name: FUNCTION start_territory_war(p_attacker_club uuid, p_territory uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_territory_war(p_attacker_club uuid, p_territory uuid) TO anon;
GRANT ALL ON FUNCTION public.start_territory_war(p_attacker_club uuid, p_territory uuid) TO authenticated;
GRANT ALL ON FUNCTION public.start_territory_war(p_attacker_club uuid, p_territory uuid) TO service_role;


--
-- Name: FUNCTION start_war_from_unit_arrival(p_movement_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_war_from_unit_arrival(p_movement_id uuid) TO anon;
GRANT ALL ON FUNCTION public.start_war_from_unit_arrival(p_movement_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.start_war_from_unit_arrival(p_movement_id uuid) TO service_role;


--
-- Name: FUNCTION sync_balance_from_ledger(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.sync_balance_from_ledger() TO anon;
GRANT ALL ON FUNCTION public.sync_balance_from_ledger() TO authenticated;
GRANT ALL ON FUNCTION public.sync_balance_from_ledger() TO service_role;


--
-- Name: FUNCTION trigger_check_and_resolve(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trigger_check_and_resolve() TO anon;
GRANT ALL ON FUNCTION public.trigger_check_and_resolve() TO authenticated;
GRANT ALL ON FUNCTION public.trigger_check_and_resolve() TO service_role;


--
-- Name: FUNCTION trigger_check_and_resolve_war(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trigger_check_and_resolve_war() TO anon;
GRANT ALL ON FUNCTION public.trigger_check_and_resolve_war() TO authenticated;
GRANT ALL ON FUNCTION public.trigger_check_and_resolve_war() TO service_role;


--
-- Name: FUNCTION update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid) TO anon;
GRANT ALL ON FUNCTION public.update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid) TO authenticated;
GRANT ALL ON FUNCTION public.update_club_elo(p_season_id uuid, p_club_a uuid, p_club_b uuid, p_winner uuid) TO service_role;


--
-- Name: FUNCTION update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid) TO anon;
GRANT ALL ON FUNCTION public.update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid) TO authenticated;
GRANT ALL ON FUNCTION public.update_club_rivalry(p_club_a uuid, p_club_b uuid, p_winner uuid) TO service_role;


--
-- Name: FUNCTION update_club_war_xp(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_club_war_xp() TO anon;
GRANT ALL ON FUNCTION public.update_club_war_xp() TO authenticated;
GRANT ALL ON FUNCTION public.update_club_war_xp() TO service_role;


--
-- Name: FUNCTION use_referral_code(p_code text, p_user uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.use_referral_code(p_code text, p_user uuid) TO anon;
GRANT ALL ON FUNCTION public.use_referral_code(p_code text, p_user uuid) TO authenticated;
GRANT ALL ON FUNCTION public.use_referral_code(p_code text, p_user uuid) TO service_role;


--
-- Name: FUNCTION xp_for_level(level_num integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.xp_for_level(level_num integer) TO anon;
GRANT ALL ON FUNCTION public.xp_for_level(level_num integer) TO authenticated;
GRANT ALL ON FUNCTION public.xp_for_level(level_num integer) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- Name: TABLE job; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT SELECT ON TABLE cron.job TO postgres WITH GRANT OPTION;


--
-- Name: TABLE job_run_details; Type: ACL; Schema: cron; Owner: supabase_admin
--

GRANT ALL ON TABLE cron.job_run_details TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE active_club_wars; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_club_wars TO anon;
GRANT ALL ON TABLE public.active_club_wars TO authenticated;
GRANT ALL ON TABLE public.active_club_wars TO service_role;


--
-- Name: TABLE clubs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.clubs TO anon;
GRANT ALL ON TABLE public.clubs TO authenticated;
GRANT ALL ON TABLE public.clubs TO service_role;


--
-- Name: TABLE guild_tournament_entries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.guild_tournament_entries TO anon;
GRANT ALL ON TABLE public.guild_tournament_entries TO authenticated;
GRANT ALL ON TABLE public.guild_tournament_entries TO service_role;


--
-- Name: TABLE guild_tournaments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.guild_tournaments TO anon;
GRANT ALL ON TABLE public.guild_tournaments TO authenticated;
GRANT ALL ON TABLE public.guild_tournaments TO service_role;


--
-- Name: TABLE active_guild_tournament_board; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_guild_tournament_board TO anon;
GRANT ALL ON TABLE public.active_guild_tournament_board TO authenticated;
GRANT ALL ON TABLE public.active_guild_tournament_board TO service_role;


--
-- Name: TABLE club_season_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_season_stats TO anon;
GRANT ALL ON TABLE public.club_season_stats TO authenticated;
GRANT ALL ON TABLE public.club_season_stats TO service_role;


--
-- Name: TABLE seasons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.seasons TO anon;
GRANT ALL ON TABLE public.seasons TO authenticated;
GRANT ALL ON TABLE public.seasons TO service_role;


--
-- Name: TABLE active_season_club_leaderboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_season_club_leaderboard TO anon;
GRANT ALL ON TABLE public.active_season_club_leaderboard TO authenticated;
GRANT ALL ON TABLE public.active_season_club_leaderboard TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE war_contributions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_contributions TO anon;
GRANT ALL ON TABLE public.war_contributions TO authenticated;
GRANT ALL ON TABLE public.war_contributions TO service_role;


--
-- Name: TABLE active_season_player_leaderboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_season_player_leaderboard TO anon;
GRANT ALL ON TABLE public.active_season_player_leaderboard TO authenticated;
GRANT ALL ON TABLE public.active_season_player_leaderboard TO service_role;


--
-- Name: TABLE admin_audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_audit_logs TO anon;
GRANT ALL ON TABLE public.admin_audit_logs TO authenticated;
GRANT ALL ON TABLE public.admin_audit_logs TO service_role;


--
-- Name: TABLE alliance_invites; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alliance_invites TO anon;
GRANT ALL ON TABLE public.alliance_invites TO authenticated;
GRANT ALL ON TABLE public.alliance_invites TO service_role;


--
-- Name: TABLE alliance_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alliance_members TO anon;
GRANT ALL ON TABLE public.alliance_members TO authenticated;
GRANT ALL ON TABLE public.alliance_members TO service_role;


--
-- Name: TABLE alliance_member_details; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alliance_member_details TO anon;
GRANT ALL ON TABLE public.alliance_member_details TO authenticated;
GRANT ALL ON TABLE public.alliance_member_details TO service_role;


--
-- Name: TABLE alliances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alliances TO anon;
GRANT ALL ON TABLE public.alliances TO authenticated;
GRANT ALL ON TABLE public.alliances TO service_role;


--
-- Name: TABLE alliance_overview; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alliance_overview TO anon;
GRANT ALL ON TABLE public.alliance_overview TO authenticated;
GRANT ALL ON TABLE public.alliance_overview TO service_role;


--
-- Name: TABLE arena_ledger; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.arena_ledger TO anon;
GRANT ALL ON TABLE public.arena_ledger TO authenticated;
GRANT ALL ON TABLE public.arena_ledger TO service_role;


--
-- Name: SEQUENCE arena_ledger_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.arena_ledger_id_seq TO anon;
GRANT ALL ON SEQUENCE public.arena_ledger_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.arena_ledger_id_seq TO service_role;


--
-- Name: TABLE arena_prizes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.arena_prizes TO anon;
GRANT ALL ON TABLE public.arena_prizes TO authenticated;
GRANT ALL ON TABLE public.arena_prizes TO service_role;


--
-- Name: SEQUENCE arena_prizes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.arena_prizes_id_seq TO anon;
GRANT ALL ON SEQUENCE public.arena_prizes_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.arena_prizes_id_seq TO service_role;


--
-- Name: TABLE arena_transactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.arena_transactions TO anon;
GRANT ALL ON TABLE public.arena_transactions TO authenticated;
GRANT ALL ON TABLE public.arena_transactions TO service_role;


--
-- Name: TABLE army_group_units; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.army_group_units TO anon;
GRANT ALL ON TABLE public.army_group_units TO authenticated;
GRANT ALL ON TABLE public.army_group_units TO service_role;


--
-- Name: TABLE army_groups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.army_groups TO anon;
GRANT ALL ON TABLE public.army_groups TO authenticated;
GRANT ALL ON TABLE public.army_groups TO service_role;


--
-- Name: TABLE club_territories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_territories TO anon;
GRANT ALL ON TABLE public.club_territories TO authenticated;
GRANT ALL ON TABLE public.club_territories TO service_role;


--
-- Name: TABLE club_units; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_units TO anon;
GRANT ALL ON TABLE public.club_units TO authenticated;
GRANT ALL ON TABLE public.club_units TO service_role;


--
-- Name: TABLE army_stacks_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.army_stacks_live TO anon;
GRANT ALL ON TABLE public.army_stacks_live TO authenticated;
GRANT ALL ON TABLE public.army_stacks_live TO service_role;


--
-- Name: TABLE army_units_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.army_units_live TO anon;
GRANT ALL ON TABLE public.army_units_live TO authenticated;
GRANT ALL ON TABLE public.army_units_live TO service_role;


--
-- Name: TABLE badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.badges TO anon;
GRANT ALL ON TABLE public.badges TO authenticated;
GRANT ALL ON TABLE public.badges TO service_role;


--
-- Name: TABLE battle_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.battle_logs TO anon;
GRANT ALL ON TABLE public.battle_logs TO authenticated;
GRANT ALL ON TABLE public.battle_logs TO service_role;


--
-- Name: TABLE boss_damage; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.boss_damage TO anon;
GRANT ALL ON TABLE public.boss_damage TO authenticated;
GRANT ALL ON TABLE public.boss_damage TO service_role;


--
-- Name: TABLE club_activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_activities TO anon;
GRANT ALL ON TABLE public.club_activities TO authenticated;
GRANT ALL ON TABLE public.club_activities TO service_role;


--
-- Name: TABLE club_ban_appeals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_ban_appeals TO anon;
GRANT ALL ON TABLE public.club_ban_appeals TO authenticated;
GRANT ALL ON TABLE public.club_ban_appeals TO service_role;


--
-- Name: TABLE club_banned_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_banned_members TO anon;
GRANT ALL ON TABLE public.club_banned_members TO authenticated;
GRANT ALL ON TABLE public.club_banned_members TO service_role;


--
-- Name: TABLE club_challenge_contributions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_challenge_contributions TO anon;
GRANT ALL ON TABLE public.club_challenge_contributions TO authenticated;
GRANT ALL ON TABLE public.club_challenge_contributions TO service_role;


--
-- Name: TABLE club_challenge_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_challenge_templates TO anon;
GRANT ALL ON TABLE public.club_challenge_templates TO authenticated;
GRANT ALL ON TABLE public.club_challenge_templates TO service_role;


--
-- Name: TABLE club_challenges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_challenges TO anon;
GRANT ALL ON TABLE public.club_challenges TO authenticated;
GRANT ALL ON TABLE public.club_challenges TO service_role;


--
-- Name: TABLE club_domination_map; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_domination_map TO anon;
GRANT ALL ON TABLE public.club_domination_map TO authenticated;
GRANT ALL ON TABLE public.club_domination_map TO service_role;


--
-- Name: TABLE club_join_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_join_requests TO anon;
GRANT ALL ON TABLE public.club_join_requests TO authenticated;
GRANT ALL ON TABLE public.club_join_requests TO service_role;


--
-- Name: TABLE club_leaderboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_leaderboard TO anon;
GRANT ALL ON TABLE public.club_leaderboard TO authenticated;
GRANT ALL ON TABLE public.club_leaderboard TO service_role;


--
-- Name: TABLE club_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_members TO anon;
GRANT ALL ON TABLE public.club_members TO authenticated;
GRANT ALL ON TABLE public.club_members TO service_role;


--
-- Name: TABLE club_message_reactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_message_reactions TO anon;
GRANT ALL ON TABLE public.club_message_reactions TO authenticated;
GRANT ALL ON TABLE public.club_message_reactions TO service_role;


--
-- Name: TABLE club_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_messages TO anon;
GRANT ALL ON TABLE public.club_messages TO authenticated;
GRANT ALL ON TABLE public.club_messages TO service_role;


--
-- Name: TABLE club_moderation_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_moderation_logs TO anon;
GRANT ALL ON TABLE public.club_moderation_logs TO authenticated;
GRANT ALL ON TABLE public.club_moderation_logs TO service_role;


--
-- Name: TABLE club_muted_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_muted_members TO anon;
GRANT ALL ON TABLE public.club_muted_members TO authenticated;
GRANT ALL ON TABLE public.club_muted_members TO service_role;


--
-- Name: TABLE club_poll_options; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_poll_options TO anon;
GRANT ALL ON TABLE public.club_poll_options TO authenticated;
GRANT ALL ON TABLE public.club_poll_options TO service_role;


--
-- Name: TABLE club_poll_votes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_poll_votes TO anon;
GRANT ALL ON TABLE public.club_poll_votes TO authenticated;
GRANT ALL ON TABLE public.club_poll_votes TO service_role;


--
-- Name: TABLE club_polls; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_polls TO anon;
GRANT ALL ON TABLE public.club_polls TO authenticated;
GRANT ALL ON TABLE public.club_polls TO service_role;


--
-- Name: TABLE club_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_rewards TO anon;
GRANT ALL ON TABLE public.club_rewards TO authenticated;
GRANT ALL ON TABLE public.club_rewards TO service_role;


--
-- Name: TABLE club_rivalries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_rivalries TO anon;
GRANT ALL ON TABLE public.club_rivalries TO authenticated;
GRANT ALL ON TABLE public.club_rivalries TO service_role;


--
-- Name: TABLE club_season_leaderboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_season_leaderboard TO anon;
GRANT ALL ON TABLE public.club_season_leaderboard TO authenticated;
GRANT ALL ON TABLE public.club_season_leaderboard TO service_role;


--
-- Name: TABLE club_season_rankings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_season_rankings TO anon;
GRANT ALL ON TABLE public.club_season_rankings TO authenticated;
GRANT ALL ON TABLE public.club_season_rankings TO service_role;


--
-- Name: TABLE club_season_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_season_rewards TO anon;
GRANT ALL ON TABLE public.club_season_rewards TO authenticated;
GRANT ALL ON TABLE public.club_season_rewards TO service_role;


--
-- Name: TABLE club_seasons; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_seasons TO anon;
GRANT ALL ON TABLE public.club_seasons TO authenticated;
GRANT ALL ON TABLE public.club_seasons TO service_role;


--
-- Name: TABLE club_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_stats TO anon;
GRANT ALL ON TABLE public.club_stats TO authenticated;
GRANT ALL ON TABLE public.club_stats TO service_role;


--
-- Name: TABLE club_territory_leaderboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_territory_leaderboard TO anon;
GRANT ALL ON TABLE public.club_territory_leaderboard TO authenticated;
GRANT ALL ON TABLE public.club_territory_leaderboard TO service_role;


--
-- Name: TABLE club_top_members; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_top_members TO anon;
GRANT ALL ON TABLE public.club_top_members TO authenticated;
GRANT ALL ON TABLE public.club_top_members TO service_role;


--
-- Name: TABLE club_war_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_war_scores TO anon;
GRANT ALL ON TABLE public.club_war_scores TO authenticated;
GRANT ALL ON TABLE public.club_war_scores TO service_role;


--
-- Name: TABLE club_wars_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_wars_live TO anon;
GRANT ALL ON TABLE public.club_wars_live TO authenticated;
GRANT ALL ON TABLE public.club_wars_live TO service_role;


--
-- Name: TABLE club_weekly_rankings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.club_weekly_rankings TO anon;
GRANT ALL ON TABLE public.club_weekly_rankings TO authenticated;
GRANT ALL ON TABLE public.club_weekly_rankings TO service_role;


--
-- Name: TABLE cosmetics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cosmetics TO anon;
GRANT ALL ON TABLE public.cosmetics TO authenticated;
GRANT ALL ON TABLE public.cosmetics TO service_role;


--
-- Name: TABLE daily_challenges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.daily_challenges TO anon;
GRANT ALL ON TABLE public.daily_challenges TO authenticated;
GRANT ALL ON TABLE public.daily_challenges TO service_role;


--
-- Name: TABLE fog_of_war_territories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fog_of_war_territories TO anon;
GRANT ALL ON TABLE public.fog_of_war_territories TO authenticated;
GRANT ALL ON TABLE public.fog_of_war_territories TO service_role;


--
-- Name: TABLE territory_adjacency; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_adjacency TO anon;
GRANT ALL ON TABLE public.territory_adjacency TO authenticated;
GRANT ALL ON TABLE public.territory_adjacency TO service_role;


--
-- Name: TABLE frontline_edges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.frontline_edges TO anon;
GRANT ALL ON TABLE public.frontline_edges TO authenticated;
GRANT ALL ON TABLE public.frontline_edges TO service_role;


--
-- Name: TABLE frontline_territories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.frontline_territories TO anon;
GRANT ALL ON TABLE public.frontline_territories TO authenticated;
GRANT ALL ON TABLE public.frontline_territories TO service_role;


--
-- Name: TABLE global_club_ranking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.global_club_ranking TO anon;
GRANT ALL ON TABLE public.global_club_ranking TO authenticated;
GRANT ALL ON TABLE public.global_club_ranking TO service_role;


--
-- Name: TABLE global_player_ranking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.global_player_ranking TO anon;
GRANT ALL ON TABLE public.global_player_ranking TO authenticated;
GRANT ALL ON TABLE public.global_player_ranking TO service_role;


--
-- Name: TABLE season_hall_of_fame; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.season_hall_of_fame TO anon;
GRANT ALL ON TABLE public.season_hall_of_fame TO authenticated;
GRANT ALL ON TABLE public.season_hall_of_fame TO service_role;


--
-- Name: TABLE hall_of_fame_public; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.hall_of_fame_public TO anon;
GRANT ALL ON TABLE public.hall_of_fame_public TO authenticated;
GRANT ALL ON TABLE public.hall_of_fame_public TO service_role;


--
-- Name: TABLE leaderboard_global; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leaderboard_global TO anon;
GRANT ALL ON TABLE public.leaderboard_global TO authenticated;
GRANT ALL ON TABLE public.leaderboard_global TO service_role;


--
-- Name: TABLE leaderboard_war; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leaderboard_war TO anon;
GRANT ALL ON TABLE public.leaderboard_war TO authenticated;
GRANT ALL ON TABLE public.leaderboard_war TO service_role;


--
-- Name: TABLE level_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.level_rewards TO anon;
GRANT ALL ON TABLE public.level_rewards TO authenticated;
GRANT ALL ON TABLE public.level_rewards TO service_role;


--
-- Name: TABLE live_club_war; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.live_club_war TO anon;
GRANT ALL ON TABLE public.live_club_war TO authenticated;
GRANT ALL ON TABLE public.live_club_war TO service_role;


--
-- Name: TABLE matches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.matches TO anon;
GRANT ALL ON TABLE public.matches TO authenticated;
GRANT ALL ON TABLE public.matches TO service_role;


--
-- Name: TABLE player_cosmetics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.player_cosmetics TO anon;
GRANT ALL ON TABLE public.player_cosmetics TO authenticated;
GRANT ALL ON TABLE public.player_cosmetics TO service_role;


--
-- Name: TABLE player_prestige; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.player_prestige TO anon;
GRANT ALL ON TABLE public.player_prestige TO authenticated;
GRANT ALL ON TABLE public.player_prestige TO service_role;


--
-- Name: TABLE predictions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.predictions TO anon;
GRANT ALL ON TABLE public.predictions TO authenticated;
GRANT ALL ON TABLE public.predictions TO service_role;


--
-- Name: TABLE prize_redemptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.prize_redemptions TO anon;
GRANT ALL ON TABLE public.prize_redemptions TO authenticated;
GRANT ALL ON TABLE public.prize_redemptions TO service_role;


--
-- Name: TABLE ranked_club_board; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ranked_club_board TO anon;
GRANT ALL ON TABLE public.ranked_club_board TO authenticated;
GRANT ALL ON TABLE public.ranked_club_board TO service_role;


--
-- Name: TABLE ranked_matches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ranked_matches TO anon;
GRANT ALL ON TABLE public.ranked_matches TO authenticated;
GRANT ALL ON TABLE public.ranked_matches TO service_role;


--
-- Name: TABLE rate_limits; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rate_limits TO anon;
GRANT ALL ON TABLE public.rate_limits TO authenticated;
GRANT ALL ON TABLE public.rate_limits TO service_role;


--
-- Name: TABLE referral_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.referral_codes TO anon;
GRANT ALL ON TABLE public.referral_codes TO authenticated;
GRANT ALL ON TABLE public.referral_codes TO service_role;


--
-- Name: TABLE referrals; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.referrals TO anon;
GRANT ALL ON TABLE public.referrals TO authenticated;
GRANT ALL ON TABLE public.referrals TO service_role;


--
-- Name: TABLE season_club_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.season_club_scores TO anon;
GRANT ALL ON TABLE public.season_club_scores TO authenticated;
GRANT ALL ON TABLE public.season_club_scores TO service_role;


--
-- Name: TABLE season_xp; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.season_xp TO anon;
GRANT ALL ON TABLE public.season_xp TO authenticated;
GRANT ALL ON TABLE public.season_xp TO service_role;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscriptions TO anon;
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;


--
-- Name: TABLE support_inquiries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.support_inquiries TO anon;
GRANT ALL ON TABLE public.support_inquiries TO authenticated;
GRANT ALL ON TABLE public.support_inquiries TO service_role;


--
-- Name: TABLE territory_adjacency_debug; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_adjacency_debug TO anon;
GRANT ALL ON TABLE public.territory_adjacency_debug TO authenticated;
GRANT ALL ON TABLE public.territory_adjacency_debug TO service_role;


--
-- Name: TABLE territory_connections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_connections TO anon;
GRANT ALL ON TABLE public.territory_connections TO authenticated;
GRANT ALL ON TABLE public.territory_connections TO service_role;


--
-- Name: TABLE territory_domination; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_domination TO anon;
GRANT ALL ON TABLE public.territory_domination TO authenticated;
GRANT ALL ON TABLE public.territory_domination TO service_role;


--
-- Name: TABLE territory_economy; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_economy TO anon;
GRANT ALL ON TABLE public.territory_economy TO authenticated;
GRANT ALL ON TABLE public.territory_economy TO service_role;


--
-- Name: TABLE territory_influence; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_influence TO anon;
GRANT ALL ON TABLE public.territory_influence TO authenticated;
GRANT ALL ON TABLE public.territory_influence TO service_role;


--
-- Name: TABLE territory_influence_map; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_influence_map TO anon;
GRANT ALL ON TABLE public.territory_influence_map TO authenticated;
GRANT ALL ON TABLE public.territory_influence_map TO service_role;


--
-- Name: TABLE territory_paths; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.territory_paths TO anon;
GRANT ALL ON TABLE public.territory_paths TO authenticated;
GRANT ALL ON TABLE public.territory_paths TO service_role;


--
-- Name: TABLE unit_encounters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unit_encounters TO anon;
GRANT ALL ON TABLE public.unit_encounters TO authenticated;
GRANT ALL ON TABLE public.unit_encounters TO service_role;


--
-- Name: TABLE unit_movements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unit_movements TO anon;
GRANT ALL ON TABLE public.unit_movements TO authenticated;
GRANT ALL ON TABLE public.unit_movements TO service_role;


--
-- Name: TABLE unit_movements_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unit_movements_live TO anon;
GRANT ALL ON TABLE public.unit_movements_live TO authenticated;
GRANT ALL ON TABLE public.unit_movements_live TO service_role;


--
-- Name: TABLE unit_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.unit_orders TO anon;
GRANT ALL ON TABLE public.unit_orders TO authenticated;
GRANT ALL ON TABLE public.unit_orders TO service_role;


--
-- Name: TABLE user_badges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_badges TO anon;
GRANT ALL ON TABLE public.user_badges TO authenticated;
GRANT ALL ON TABLE public.user_badges TO service_role;


--
-- Name: TABLE user_balances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_balances TO anon;
GRANT ALL ON TABLE public.user_balances TO authenticated;
GRANT ALL ON TABLE public.user_balances TO service_role;


--
-- Name: TABLE user_daily_challenges; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_daily_challenges TO anon;
GRANT ALL ON TABLE public.user_daily_challenges TO authenticated;
GRANT ALL ON TABLE public.user_daily_challenges TO service_role;


--
-- Name: TABLE user_level_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_level_rewards TO anon;
GRANT ALL ON TABLE public.user_level_rewards TO authenticated;
GRANT ALL ON TABLE public.user_level_rewards TO service_role;


--
-- Name: TABLE user_notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_notifications TO anon;
GRANT ALL ON TABLE public.user_notifications TO authenticated;
GRANT ALL ON TABLE public.user_notifications TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: TABLE user_season_tiers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_season_tiers TO anon;
GRANT ALL ON TABLE public.user_season_tiers TO authenticated;
GRANT ALL ON TABLE public.user_season_tiers TO service_role;


--
-- Name: TABLE v_matches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.v_matches TO anon;
GRANT ALL ON TABLE public.v_matches TO authenticated;
GRANT ALL ON TABLE public.v_matches TO service_role;


--
-- Name: TABLE visible_territories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visible_territories TO anon;
GRANT ALL ON TABLE public.visible_territories TO authenticated;
GRANT ALL ON TABLE public.visible_territories TO service_role;


--
-- Name: TABLE visible_territories_live; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.visible_territories_live TO anon;
GRANT ALL ON TABLE public.visible_territories_live TO authenticated;
GRANT ALL ON TABLE public.visible_territories_live TO service_role;


--
-- Name: TABLE war_heatmap; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_heatmap TO anon;
GRANT ALL ON TABLE public.war_heatmap TO authenticated;
GRANT ALL ON TABLE public.war_heatmap TO service_role;


--
-- Name: TABLE war_live_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_live_stats TO anon;
GRANT ALL ON TABLE public.war_live_stats TO authenticated;
GRANT ALL ON TABLE public.war_live_stats TO service_role;


--
-- Name: TABLE war_map_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_map_data TO anon;
GRANT ALL ON TABLE public.war_map_data TO authenticated;
GRANT ALL ON TABLE public.war_map_data TO service_role;


--
-- Name: TABLE war_map_full; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_map_full TO anon;
GRANT ALL ON TABLE public.war_map_full TO authenticated;
GRANT ALL ON TABLE public.war_map_full TO service_role;


--
-- Name: TABLE war_mvp; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_mvp TO anon;
GRANT ALL ON TABLE public.war_mvp TO authenticated;
GRANT ALL ON TABLE public.war_mvp TO service_role;


--
-- Name: TABLE war_mvp_top; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_mvp_top TO anon;
GRANT ALL ON TABLE public.war_mvp_top TO authenticated;
GRANT ALL ON TABLE public.war_mvp_top TO service_role;


--
-- Name: TABLE war_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.war_stats TO anon;
GRANT ALL ON TABLE public.war_stats TO authenticated;
GRANT ALL ON TABLE public.war_stats TO service_role;


--
-- Name: TABLE weekly_rankings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.weekly_rankings TO anon;
GRANT ALL ON TABLE public.weekly_rankings TO authenticated;
GRANT ALL ON TABLE public.weekly_rankings TO service_role;


--
-- Name: TABLE weekly_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.weekly_rewards TO anon;
GRANT ALL ON TABLE public.weekly_rewards TO authenticated;
GRANT ALL ON TABLE public.weekly_rewards TO service_role;


--
-- Name: TABLE world_boss; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.world_boss TO anon;
GRANT ALL ON TABLE public.world_boss TO authenticated;
GRANT ALL ON TABLE public.world_boss TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE messages_2026_03_19; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_19 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_19 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_20; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_20 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_20 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_21; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_21 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_21 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_22; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_22 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_22 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_23; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_23 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_23 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_24; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_24 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_24 TO dashboard_user;


--
-- Name: TABLE messages_2026_03_25; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.messages_2026_03_25 TO postgres;
GRANT ALL ON TABLE realtime.messages_2026_03_25 TO dashboard_user;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cron; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA cron GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: ensure_rls; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
         WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
   EXECUTE FUNCTION public.rls_auto_enable();


ALTER EVENT TRIGGER ensure_rls OWNER TO postgres;

--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

\unrestrict vgMoufxLtzhAm0rSMt5Ms3MUb7uPLvb6Y3WhN8aPZcfp6OuOnqArS9XL0zAModk

