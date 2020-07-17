CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.groups
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    owner_id character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_groups" PRIMARY KEY (id)
)
TABLESPACE pg_default;


CREATE TABLE public.group_members
(
    group_id uuid NOT NULL,
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_group_members" PRIMARY KEY (group_id, user_id),
    CONSTRAINT "FK_groups" FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
