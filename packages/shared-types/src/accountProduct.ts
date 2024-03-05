export type AccountProduct = {
  id: string;
  object: string;
  active: boolean;
  name: string;
  description: string;

  price: {
    // Grosze
    amount: number;
    currency: string;
  };

  metadata: {
    userType: string;
  };
};

export type AccountStatus = {
  type: "PREMIUM" | "ADMIN" | "FREE";
  sub: {
    endsAt: Date;
    status:
      | "active"
      | "canceled"
      | "incomplete"
      | "incomplete_expired"
      | "past_due"
      | "paused"
      | "trialing"
      | "unpaid";
    renews: boolean;
  } | null;
};
