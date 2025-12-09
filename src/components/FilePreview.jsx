import { useEffect, useState } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { getSignedUrl } from "../services/fileService";
import Modal from "./Modal";

const CustomHeader = (state, prev, next) => {
  if (!state.currentDocument) return null;
  const fileName = state.currentDocument.fileName || "Untitled File";
  return (
    <div className="flex justify-between items-center px-2 py-1 bg-gray-500">
      <h2 className="text-lg font-semibold truncate text-white">{fileName}</h2>
    </div>
  );
};

export default function FilePreview({ file, onClose }) {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    async function load() {
      const url = await getSignedUrl(file.id);

      setDocs([{ uri: url, fileName: file.originalFileName || "Document" }]);
    }

    load();
  }, [file]);

  return (
    <Modal onClose={onClose} className={"w-[70%] h-screen p-[0px]"}>
      {docs.length > 0 ? (
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          style={{ height: "100vh" }}
          config={{
            header: {
              overrideComponent: CustomHeader,
            },
          }}
        />
      ) : (
        <div>Loading preview...</div>
      )}
    </Modal>
  );
}
