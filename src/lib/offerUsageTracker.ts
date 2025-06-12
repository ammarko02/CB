import { Offer, EmployeeOfferUsage, OfferUsageLimit } from "@/types";

export class OfferUsageTracker {
  private static usageData: Map<string, EmployeeOfferUsage> = new Map();

  /**
   * Check if employee can redeem the offer based on usage limits
   */
  static canEmployeeRedeemOffer(
    employeeId: string,
    offer: Offer,
  ): { canRedeem: boolean; reason?: string } {
    const usageKey = `${employeeId}_${offer.id}`;
    const usage = this.usageData.get(usageKey);

    switch (offer.usageLimit) {
      case "unlimited":
        return { canRedeem: true };

      case "once_per_employee":
        if (usage && usage.usageCount > 0) {
          return {
            canRedeem: false,
            reason:
              "لقد استخدمت هذا العرض مسبقاً. العرض متاح للاستخدام مرة واحدة فقط.",
          };
        }
        return { canRedeem: true };

      case "multiple_uses":
        const maxUses = offer.usesPerEmployee || 1;
        if (usage && usage.usageCount >= maxUses) {
          return {
            canRedeem: false,
            reason: `لقد وصلت للحد الأقصى من الاستخدام (${maxUses} مرات).`,
          };
        }
        return { canRedeem: true };

      default:
        return { canRedeem: true };
    }
  }

  /**
   * Record a new usage for an employee and offer
   */
  static recordUsage(
    employeeId: string,
    offer: Offer,
    discountCode?: string,
  ): void {
    const usageKey = `${employeeId}_${offer.id}`;
    const existing = this.usageData.get(usageKey);

    if (existing) {
      existing.usageCount += 1;
      existing.lastUsedAt = new Date().toISOString();
      if (discountCode) {
        existing.discountCodes.push(discountCode);
      }
    } else {
      const newUsage: EmployeeOfferUsage = {
        id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        employeeId,
        offerId: offer.id,
        usageCount: 1,
        lastUsedAt: new Date().toISOString(),
        discountCards: [],
        discountCodes: discountCode ? [discountCode] : [],
      };
      this.usageData.set(usageKey, newUsage);
    }
  }

  /**
   * Get usage statistics for an employee and offer
   */
  static getUsageStats(
    employeeId: string,
    offerId: string,
  ): EmployeeOfferUsage | null {
    const usageKey = `${employeeId}_${offerId}`;
    return this.usageData.get(usageKey) || null;
  }

  /**
   * Get remaining uses for an employee and offer
   */
  static getRemainingUses(employeeId: string, offer: Offer): number | null {
    if (offer.usageLimit === "unlimited") return null;
    if (offer.usageLimit === "once_per_employee") {
      const usage = this.getUsageStats(employeeId, offer.id);
      return usage ? 0 : 1;
    }
    if (offer.usageLimit === "multiple_uses") {
      const maxUses = offer.usesPerEmployee || 1;
      const usage = this.getUsageStats(employeeId, offer.id);
      return maxUses - (usage?.usageCount || 0);
    }
    return null;
  }

  /**
   * Check if offer should be hidden from browse view (for once_per_employee used offers)
   */
  static shouldHideOfferFromBrowse(employeeId: string, offer: Offer): boolean {
    if (offer.usageLimit === "once_per_employee") {
      const usage = this.getUsageStats(employeeId, offer.id);
      return !!(usage && usage.usageCount > 0);
    }
    return false;
  }

  /**
   * Generate usage status text for UI
   */
  static getUsageStatusText(employeeId: string, offer: Offer): string {
    const remaining = this.getRemainingUses(employeeId, offer);

    if (offer.usageLimit === "unlimited") {
      return "استخدام غير محدود";
    }

    if (offer.usageLimit === "once_per_employee") {
      return remaining === 0 ? "تم الاستخدام" : "مرة واحدة فقط";
    }

    if (offer.usageLimit === "multiple_uses") {
      const maxUses = offer.usesPerEmployee || 1;
      const used = this.getUsageStats(employeeId, offer.id)?.usageCount || 0;
      return `${remaining} من ${maxUses} متبقية`;
    }

    return "متاح";
  }

  /**
   * Clear all usage data (for testing or reset purposes)
   */
  static clearAllUsage(): void {
    this.usageData.clear();
  }

  /**
   * Get all usage data for debugging
   */
  static getAllUsageData(): Map<string, EmployeeOfferUsage> {
    return new Map(this.usageData);
  }
}
