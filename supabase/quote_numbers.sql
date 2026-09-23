-- Progressive quote numbers for Momopolis booking requests.
-- Existing rows intentionally remain NULL, so the first new real request is quote 1.
create sequence if not exists public.booking_quote_number_seq start with 1;

alter table public.bookings
  add column if not exists quote_number bigint;

alter sequence public.booking_quote_number_seq
  owned by public.bookings.quote_number;

alter table public.bookings
  alter column quote_number
  set default nextval('public.booking_quote_number_seq');

create unique index if not exists bookings_quote_number_key
  on public.bookings (quote_number)
  where quote_number is not null;

-- Keep the next number aligned with the data already stored. On a fresh
-- installation (all previous bookings remain NULL), the first new quote is 1.
select setval(
  'public.booking_quote_number_seq',
  coalesce((select max(quote_number) from public.bookings), 1),
  exists(select 1 from public.bookings where quote_number is not null)
);

notify pgrst, 'reload schema';
