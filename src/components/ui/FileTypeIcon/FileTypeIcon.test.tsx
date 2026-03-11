import { render, screen } from "@/tests/app-test-utils";
import { FileTypeIcon, getFileType } from ".";

describe("getFileType", () => {
  describe("extension-based detection", () => {
    it("returns pdf for .pdf extension", () => {
      expect(getFileType("doc.pdf")).toBe("pdf");
    });

    it("returns doc for .doc extension", () => {
      expect(getFileType("file.doc")).toBe("doc");
    });

    it("returns doc for .docx extension", () => {
      expect(getFileType("file.docx")).toBe("doc");
    });

    it("returns xls for .xls extension", () => {
      expect(getFileType("sheet.xls")).toBe("xls");
    });

    it("returns xls for .xlsx extension", () => {
      expect(getFileType("sheet.xlsx")).toBe("xls");
    });

    it("returns txt for .txt extension", () => {
      expect(getFileType("notes.txt")).toBe("txt");
    });

    it("returns image for .jpg extension", () => {
      expect(getFileType("photo.jpg")).toBe("image");
    });

    it("returns image for .jpeg extension", () => {
      expect(getFileType("photo.jpeg")).toBe("image");
    });

    it("returns image for .png extension", () => {
      expect(getFileType("photo.png")).toBe("image");
    });

    it("returns image for .gif extension", () => {
      expect(getFileType("animation.gif")).toBe("image");
    });

    it("returns image for .webp extension", () => {
      expect(getFileType("image.webp")).toBe("image");
    });

    it("returns default for unknown extension", () => {
      expect(getFileType("file.xyz")).toBe("default");
    });

    it("returns default for file with no extension", () => {
      expect(getFileType("Makefile")).toBe("default");
    });

    it("handles uppercase extensions via toLowerCase", () => {
      expect(getFileType("FILE.PDF")).toBe("pdf");
    });
  });

  describe("MIME type fallback", () => {
    it("uses mime type when extension is unknown - application/pdf", () => {
      expect(getFileType("file", "application/pdf")).toBe("pdf");
    });

    it("uses mime type for word documents", () => {
      expect(
        getFileType(
          "file",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
      ).toBe("doc");
    });

    it("uses mime type for word documents with word in type", () => {
      expect(getFileType("file", "application/msword")).toBe("doc");
    });

    it("uses mime type for spreadsheets with excel in type", () => {
      // NOTE: .xlsx MIME type contains "document" so it matches "doc" before "excel"
      // Use a simpler excel MIME to test the excel branch
      expect(getFileType("file", "application/vnd.ms-excel")).toBe("xls");
    });

    it("uses mime type for text/plain", () => {
      expect(getFileType("file", "text/plain")).toBe("txt");
    });

    it("uses mime type for image types", () => {
      expect(getFileType("file", "image/jpeg")).toBe("image");
    });

    it("uses mime type for image/png", () => {
      expect(getFileType("file", "image/png")).toBe("image");
    });

    it("returns default when mime type is also unknown", () => {
      expect(getFileType("file", "application/unknown")).toBe("default");
    });

    it("returns default when no extension and no mime type", () => {
      expect(getFileType("file")).toBe("default");
    });

    it("prefers extension over mime type when extension matches", () => {
      // Extension is pdf, mime type says word - extension wins
      expect(getFileType("document.pdf", "application/msword")).toBe("pdf");
    });
  });
});

describe("FileTypeIcon", () => {
  it("renders PDF label for pdf file", () => {
    render(<FileTypeIcon fileName="document.pdf" />);
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("renders DOC label for doc file", () => {
    render(<FileTypeIcon fileName="report.doc" />);
    expect(screen.getByText("DOC")).toBeInTheDocument();
  });

  it("renders DOC label for docx file", () => {
    render(<FileTypeIcon fileName="report.docx" />);
    expect(screen.getByText("DOC")).toBeInTheDocument();
  });

  it("renders XLS label for xls file", () => {
    render(<FileTypeIcon fileName="data.xls" />);
    expect(screen.getByText("XLS")).toBeInTheDocument();
  });

  it("renders XLS label for xlsx file", () => {
    render(<FileTypeIcon fileName="data.xlsx" />);
    expect(screen.getByText("XLS")).toBeInTheDocument();
  });

  it("renders TXT label for txt file", () => {
    render(<FileTypeIcon fileName="notes.txt" />);
    expect(screen.getByText("TXT")).toBeInTheDocument();
  });

  it("renders IMG label for image file (jpg)", () => {
    render(<FileTypeIcon fileName="photo.jpg" />);
    expect(screen.getByText("IMG")).toBeInTheDocument();
  });

  it("renders IMG label for image file (png)", () => {
    render(<FileTypeIcon fileName="photo.png" />);
    expect(screen.getByText("IMG")).toBeInTheDocument();
  });

  it("renders file icon for default/unknown type", () => {
    const { container } = render(<FileTypeIcon fileName="file.xyz" />);
    // No label text for default type; FileIcon component should be rendered
    expect(screen.queryByText("PDF")).not.toBeInTheDocument();
    expect(screen.queryByText("DOC")).not.toBeInTheDocument();
    expect(screen.queryByText("XLS")).not.toBeInTheDocument();
    expect(screen.queryByText("TXT")).not.toBeInTheDocument();
    expect(screen.queryByText("IMG")).not.toBeInTheDocument();
    // The container should still render something
    expect(container.firstChild).toBeInTheDocument();
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <FileTypeIcon className="custom-class" fileName="doc.pdf" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("renders with sm size", () => {
    const { container } = render(
      <FileTypeIcon fileName="document.pdf" size="sm" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("h-8", "w-8");
  });

  it("renders with md size by default", () => {
    const { container } = render(<FileTypeIcon fileName="document.pdf" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("h-10", "w-10");
  });

  it("renders with lg size", () => {
    const { container } = render(
      <FileTypeIcon fileName="document.pdf" size="lg" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("h-12", "w-12");
  });

  it("uses mime type when file has no meaningful extension", () => {
    render(<FileTypeIcon fileName="upload" mimeType="application/pdf" />);
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("renders with correct background color for pdf (red-100)", () => {
    const { container } = render(<FileTypeIcon fileName="file.pdf" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-red-100");
  });

  it("renders with correct background color for doc (blue-100)", () => {
    const { container } = render(<FileTypeIcon fileName="file.docx" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-blue-100");
  });

  it("renders with correct background color for xls (green-100)", () => {
    const { container } = render(<FileTypeIcon fileName="file.xlsx" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-green-100");
  });

  it("renders with correct background color for txt (gray-100)", () => {
    const { container } = render(<FileTypeIcon fileName="file.txt" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-gray-100");
  });

  it("renders with correct background color for image (purple-100)", () => {
    const { container } = render(<FileTypeIcon fileName="file.png" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-purple-100");
  });

  it("renders with correct background color for default (gray-200)", () => {
    const { container } = render(<FileTypeIcon fileName="file.xyz" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("bg-gray-200");
  });
});
