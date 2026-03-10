import { render, screen } from "@/tests/app-test-utils";
import FileTypeIcon, { getFileType } from "./FileTypeIcon";

describe("getFileType", () => {
  it("returns pdf for .pdf extension", () => {
    expect(getFileType("doc.pdf")).toBe("pdf");
  });
  it("returns doc for .docx extension", () => {
    expect(getFileType("file.docx")).toBe("doc");
  });
  it("returns xls for .xlsx extension", () => {
    expect(getFileType("sheet.xlsx")).toBe("xls");
  });
  it("returns image for .png extension", () => {
    expect(getFileType("photo.png")).toBe("image");
  });
  it("returns default for unknown extension", () => {
    expect(getFileType("file.xyz")).toBe("default");
  });
  it("uses mime type when extension is unknown", () => {
    expect(getFileType("file", "application/pdf")).toBe("pdf");
  });
});

describe("FileTypeIcon", () => {
  it("renders PDF label for pdf file", () => {
    render(<FileTypeIcon fileName="document.pdf" />);
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("renders DOC label for doc file", () => {
    render(<FileTypeIcon fileName="report.docx" />);
    expect(screen.getByText("DOC")).toBeInTheDocument();
  });

  it("renders IMG label for image file", () => {
    render(<FileTypeIcon fileName="photo.jpg" />);
    expect(screen.getByText("IMG")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FileTypeIcon className="custom-class" fileName="doc.pdf" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });
});
