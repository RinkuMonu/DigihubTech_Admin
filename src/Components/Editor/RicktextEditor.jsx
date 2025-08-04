import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { apiGet, apiPost } from "../../api/apiMethods";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";


const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [searchParams] = useSearchParams();
  const policyType = searchParams.get("for");
  const website = searchParams.get("website");
  const navigate = useNavigate()

  const encodeToBase64 = (str) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const decodeFromBase64 = (base64Str) => {
    return decodeURIComponent(escape(atob(base64Str)));
  };

  const fetchWebsitePolicy = async () => {
    try {
      const response = await apiGet(`api/policy/${website}`)
      if (response.status === 200) {
        setContent(decodeFromBase64(response.data[policyType]) || '')
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchWebsitePolicy()
  }, [policyType])

  const handleSave = async () => {
    try {
      const response = await apiPost('api/policy', { referenceWebsite: website, [policyType]: encodeToBase64(content) });
      if (response.status === 200) {
        alert("Content saved successfully!");
        navigate(-1);
      } else {
        console.error("Failed to save content:", response.data);
        alert("Failed to save content.");
      }
    } catch (error) {
      console.error("Error saving content:", error.message);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Editor Section */}
      <div className="">
        <h2 style={{ margin: "10px" }}>Editor</h2>
        <Editor
          apiKey="v5d9bfbmrfrx9bbf9gliohq5a0m73euhpvppaa74wpp3owe2"
          initialValue={content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "codesample",
              "emoticons",
              "autosave",
              "pagebreak",
              "nonbreaking",
              "save",
              "directionality",
              "charmap",
              "insertdatetime",
              "quickbars",
            ],
            toolbar:
              "undo redo | formatselect | bold italic underline strikethrough | \
              forecolor backcolor | alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | blockquote codesample | \
              link image media table | emoticons | removeformat fullscreen preview help | \
              pagebreak nonbreaking | charmap | insertdatetime | template | \
              quickimage quicktable | code",
            content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
            image_uploadtab: true,
            automatic_uploads: true,
            autosave_ask_before_unload: true,
            autosave_interval: "30s",
            autosave_retention: "2m",
            image_title: true,
            file_picker_types: "image",
            file_picker_callback: function (cb, value, meta) {
              var input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = function () {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                  var id = "blobid" + new Date().getTime();
                  var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                  var base64 = reader.result.split(",")[1];
                  var blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
              };
              input.click();
            },
            quickbars_selection_toolbar:
              "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
            quickbars_insert_toolbar: "quickimage quicktable",
            contextmenu: "link image imagetools table",
          }}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
      <div className="">
        <Button variant="contained" onClick={handleSave}>Submit</Button>
      </div>
    </div>
  );
};

export default RichTextEditor;