package com.pokemon.explorer.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.pokemon.explorer.state.AppState
import com.pokemon.explorer.state.Screen
import com.pokemon.explorer.ui.components.BottomNav
import com.pokemon.explorer.ui.screens.CollectionScreen
import com.pokemon.explorer.ui.screens.CompareScreen
import com.pokemon.explorer.ui.screens.DetailScreen
import com.pokemon.explorer.ui.screens.HomeScreen
import com.pokemon.explorer.ui.screens.SearchScreen
import com.pokemon.explorer.ui.screens.SettingsScreen
import com.pokemon.explorer.ui.screens.TypeGuideScreen
import com.pokemon.explorer.ui.theme.AppBackground

/**
 * The app shell: the active tab's current screen above the bottom navigation.
 *
 * Navigation is driven entirely by [AppState]; there is no navigation library, which
 * keeps the per-tab back stacks behaving exactly like the original context-based
 * implementation.
 */
@Composable
fun AppRoot(
    state: AppState,
    modifier: Modifier = Modifier,
) {
    val frame = state.currentFrame
    val showNav = !Screen.HIDDEN_NAV.contains(frame.screen)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(AppBackground)
            .statusBarsPadding(),
    ) {
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                // With no nav bar drawn, the content itself keeps clear of the
                // gesture bar; otherwise BottomNav handles that inset.
                .then(if (showNav) Modifier else Modifier.navigationBarsPadding()),
        ) {
            when (frame.screen) {
                Screen.HOME -> HomeScreen(state)
                Screen.SEARCH -> SearchScreen(state)
                Screen.DETAIL -> DetailScreen(state, id = frame.id)
                Screen.COMPARE -> CompareScreen(state, initialIdA = frame.idA)
                Screen.COLLECTION -> CollectionScreen(state)
                Screen.TYPE_GUIDE -> TypeGuideScreen(state)
                Screen.SETTINGS -> SettingsScreen(state)
                else -> HomeScreen(state)
            }
        }

        if (showNav) {
            BottomNav(
                activeTab = state.activeTab,
                onSelect = { state.selectTab(it) },
            )
        }
    }
}
