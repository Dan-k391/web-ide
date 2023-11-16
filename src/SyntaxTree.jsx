import React from "react";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { v4 as uuidv4 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        height: "100%",
        flexGrow: 1,
        overflow: "auto"
    },
});

function getTreeItems(obj) {
    let items = [];
    for (let key in obj) {
        // debugger;
        if (typeof obj[key] === "object") {
            if (Array.isArray(obj[key])) {
                items.push(
                    <TreeItem
                        nodeId={uuidv4()}
                        label={key}
                        children={obj[key].map((item) => {
                            return getTreeItems(item);
                        })}
                    />
                );
            } else {
                items.push(
                    <TreeItem
                        nodeId={uuidv4()}
                        label={key}
                        children={getTreeItems(obj[key])}
                    />
                );
            }
        } else {
            items.push(
                <TreeItem nodeId={uuidv4()} label={key + ": " + obj[key]} />
            );
        }
    }
    try {
        return (
            <TreeItem nodeId={uuidv4()} label={obj.toString()}>
                {items}
            </TreeItem>
        );
    } catch (e) {
        return items;
    }
}

export default function SyntaxTree({ ast }) {
    const classes = useStyles();

    return (
        <TreeView
            className={classes.root}
            aria-label="syntax tree"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
        >
            {getTreeItems(ast)}
        </TreeView>
    );
}
