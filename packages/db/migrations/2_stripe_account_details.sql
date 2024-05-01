CREATE TABLE cerebro2.stripe_customer
(
    id                 VARCHAR(64) NOT NULL PRIMARY KEY,
    user_id            VARCHAR(64) NOT NULL UNIQUE,
    subscription_id    VARCHAR(64) NOT NULL UNIQUE,
    stripe_customer_id VARCHAR(64) NOT NULL UNIQUE,
    active_plan        ENUM ('VIP', 'BETA_TIER'),
    plan_expiration    DATETIME    NOT NULL,

    constraint stripe_customer_user_id_fkey
        foreign key (user_id) references user (id)
            on update cascade
);