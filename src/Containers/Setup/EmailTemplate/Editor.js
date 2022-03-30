import React, { useEffect, useState } from 'react';
import { convertToRaw, EditorState, ContentState, Modifier } from 'draft-js';

import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { stateFromHTML } from 'draft-js-import-html';

const EmailEditor = (props) => {
    let [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        let html = "<p>" + props.tempBody + "</p>"
        let contentBlock = htmlToDraft(html);
        if (contentBlock) {
            let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            // let contentState = stateFromHTML(props.tempBody);
            let editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
            props.handleTemplateBody(draftToHtml(convertToRaw(editorState.getCurrentContent())))

        }
    }, [props.tempBody])

    //inserting placeholders into body
    useEffect(() => {
        if (props.insertVal) {
            insertPlaceholder('{{' + props.insertVal + '}}')
        }
    }, [props.insertVal])

    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
        props.handleTemplateBody(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }

    const insertPlaceholder = placeholderText => {
        const newContentState = Modifier.insertText(
            editorState.getCurrentContent(), // get ContentState from EditorState
            editorState.getSelection(),
            placeholderText
        );
        editorState = EditorState.createWithContent(newContentState)
        setEditorState(editorState)
        props.handleTemplateBody(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }

    return (
        <React.Fragment>
            <Editor
                editorStyle={{
                    width: '100%',
                    minHeight: 100,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'lightgray',
                }}
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={editorState => onEditorStateChange(editorState)}
            />

        </React.Fragment >
    );
};

export default EmailEditor;
