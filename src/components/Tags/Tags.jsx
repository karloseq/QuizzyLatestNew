import React, { useState, useEffect, useRef } from "react";
import { evaluateTags } from "../../constants/constants";
import { get_tag_color_index } from "../../network/communication";
import "./Tags.scss";

function Tags(props) {
    const tags = props.tags; 
    const setTags = props.setTags; 
    const MAXIMUM_TAGS = props.max ?? 12
    const tagSuggestionBox = useRef(null);
    const [newTagClicked, setNewTagClicked] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState([])

    return (
    <div className="tags">
        {tags?.map((tag, index) => (
            <div className={"tag " + (props?.readonly ? "readonly" : "")} id={"tag-" + get_tag_color_index(tag)} onClick={function() {
                if (!props.readonly) {
                    var t = [...tags]; 
                    t.splice(index, 1)
                    setTags(t)
                    if (props.onModified) {
                        props.onModified(t)
                    }
                }
            }}>
            <a className={(props?.readonly ? "readonly" : "")}>{tag}</a>
            </div>
        ))} 
        {tags?.length < MAXIMUM_TAGS && !props.readonly && 
            <div className="new-tag-cover">
                <div className="new tag" onClick={function() {
                    setNewTagClicked(!newTagClicked)
                }}>
                    <a className="newa">+ Add Tag</a>
                </div>
                {newTagClicked && <input type="text" ref={tagSuggestionBox} className="add-new-tag" name="add-new-tag" placeholder={"Enter more than 3 characters.."} onChange={function() {
                    setTagSuggestions(evaluateTags(tagSuggestionBox.current.value, tags))
                }}></input>}
                {newTagClicked && 
                    <div className="tag-suggestions">
                        {tagSuggestions.map((tag, index) => (
                            <div className="suggestion" onClick={function() {
                                if (tags.indexOf(tag) > -1) {
                                    return false; 
                                }
                                var t = [...tags]; 
                                t.push(tag)
                                setTags(t)
                                if (props.onModified) {
                                    props.onModified(t)
                                }
                            }}>
                            <a>{tag}</a>
                        </div> 
                        ))}
                    </div>
                }
                
            </div>
            
            
        }
        
    </div>)
}

export default Tags 