import { describe, expect, it } from "vitest";
import { CATEGORIES, STATUSES, STATUS_LABEL } from "../complaints";
import { computeStats, countByCategory, paginate } from "../complaint-utils";

describe("System Health & Coursework Integrity", () => {
  it("verifies all required complaint categories are registered", () => {
    const requiredCategories = [
      "electrical",
      "plumbing",
      "internet",
      "furniture",
      "cleanliness",
      "water",
      "other",
    ];

    const registered = CATEGORIES.map((c) => c.value);
    for (const cat of requiredCategories) {
      expect(registered).toContain(cat);
    }
  });

  it("verifies lifecycle complaint statuses are configured with proper display labels", () => {
    const statuses = STATUSES.map((s) => s.value);
    expect(statuses).toEqual(["pending", "in_progress", "resolved", "rejected"]);

    expect(STATUS_LABEL["pending"]).toBe("Pending");
    expect(STATUS_LABEL["in_progress"]).toBe("In Progress");
    expect(STATUS_LABEL["resolved"]).toBe("Resolved");
    expect(STATUS_LABEL["rejected"]).toBe("Rejected");
  });

  it("verifies computeStats handles zero complaints gracefully", () => {
    const emptyStats = computeStats([]);
    expect(emptyStats.total).toBe(0);
    expect(emptyStats.resolutionRate).toBe(0);
  });

  it("verifies category distribution grouping and pagination integrity", () => {
    const sample = [
      {
        id: "c1",
        student_id: "u1",
        title: "Test 1",
        description: "Desc 1",
        category: "electrical",
        hostel_block: "A",
        room_number: "101",
        image_path: null,
        status: "pending" as const,
        remarks: null,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "c2",
        student_id: "u1",
        title: "Test 2",
        description: "Desc 2",
        category: "electrical",
        hostel_block: "A",
        room_number: "102",
        image_path: null,
        status: "resolved" as const,
        remarks: null,
        assigned_to: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const distribution = countByCategory(sample);
    expect(distribution[0].category).toBe("electrical");
    expect(distribution[0].count).toBe(2);

    const page1 = paginate(sample, 1, 1);
    expect(page1).toHaveLength(1);
    expect(page1[0].id).toBe("c1");
  });
});
