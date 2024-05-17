CREATE TABLE cerebro2.wall
(
    id                 VARCHAR(64) NOT NULL PRIMARY KEY,
    user_id            VARCHAR(64) NOT NULL UNIQUE,
    subscription_id    VARCHAR(64) UNIQUE,
    stripe_customer_id VARCHAR(64) NOT NULL UNIQUE,
    active_plan        ENUM ('VIP', 'ACCESS_PLAN'),
    plan_expiration    DATETIME,

    constraint stripe_customer_user_id_fkey
        foreign key (user_id) references user (id)
            on update cascade
);