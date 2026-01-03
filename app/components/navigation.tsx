/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  AssignmentTurnedInRounded,
  ChatRounded,
  Dashboard,
  SelfImprovementRounded,
  ShieldMoonRounded,
  TipsAndUpdatesRounded,
  TrendingUpRounded,
  WorkHistoryRounded,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  ListProps,
} from "@mui/joy";
import { ReactNode, memo } from "react";
import { Link, useMatch } from "react-router-dom";

export const Navigation = memo(function Navigation(
  props: NavigationProps,
): JSX.Element {
  const { sx, ...other } = props;

  return (
    <List
      sx={{ "--ListItem-radius": "4px", ...sx }}
      size="sm"
      role="navigation"
      {...other}
    >
      <NavItem path="/today" label="Today" icon={<Dashboard />} />
      <NavItem
        path="/cfp-study"
        label="CFP Study"
        icon={<AssignmentTurnedInRounded />}
      />
      <NavItem
        path="/case-studies"
        label="Case Studies"
        icon={<WorkHistoryRounded />}
      />
      <NavItem
        path="/boundaries"
        label="Boundaries & Confidence"
        icon={<ShieldMoonRounded />}
      />
      <NavItem
        path="/ai-news"
        label="AI News"
        icon={<TipsAndUpdatesRounded />}
      />
      <NavItem
        path="/mental-health"
        label="Mental Health"
        icon={<SelfImprovementRounded />}
      />
      <NavItem
        path="/weekly-reset"
        label="Weekly Reset"
        icon={<TrendingUpRounded />}
      />
      <NavItem path="/messages" label="Messages" icon={<ChatRounded />} />
    </List>
  );
});

function NavItem(props: NavItemProps): JSX.Element {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        selected={!!useMatch(props.path)}
        to={props.path}
        aria-current="page"
      >
        <ListItemDecorator children={props.icon} />
        <ListItemContent>{props.label}</ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}

type NavigationProps = Omit<ListProps, "children">;
type NavItemProps = {
  path: string;
  label: string;
  icon: ReactNode;
};
