import userEvent from "@testing-library/user-event";
import { render, screen } from "@/tests/app-test-utils";
import { SortableTableHeader } from "./SortableTableHeader";

type Key = "spend" | "leads";

function renderHeader(
  props: Partial<React.ComponentProps<typeof SortableTableHeader<Key>>> = {}
) {
  return render(
    <table>
      <thead>
        <tr>
          <SortableTableHeader<Key>
            activeDir={null}
            activeKey={null}
            label="Investimento"
            onSortChange={jest.fn()}
            sortKey="spend"
            {...props}
          />
        </tr>
      </thead>
    </table>
  );
}

describe("SortableTableHeader", () => {
  it("reports aria-sort none when not the active column", () => {
    renderHeader({ activeKey: "leads", activeDir: "asc" });
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "none"
    );
  });

  it("reports aria-sort ascending when active and asc", () => {
    renderHeader({ activeKey: "spend", activeDir: "asc" });
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "ascending"
    );
  });

  it("reports aria-sort descending when active and desc", () => {
    renderHeader({ activeKey: "spend", activeDir: "desc" });
    expect(screen.getByRole("columnheader")).toHaveAttribute(
      "aria-sort",
      "descending"
    );
  });

  it("calls onSortChange with the key when clicked", async () => {
    const onSortChange = jest.fn();
    const user = userEvent.setup();
    renderHeader({ onSortChange });

    await user.click(screen.getByRole("button"));
    expect(onSortChange).toHaveBeenCalledWith("spend");
  });

  it("forwards buttonProps (data-testid) to the trigger", () => {
    renderHeader({ buttonProps: { "data-testid": "sort-spend" } });
    expect(screen.getByTestId("sort-spend")).toBeVisible();
  });
});
