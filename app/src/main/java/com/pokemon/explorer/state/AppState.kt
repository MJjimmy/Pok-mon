package com.pokemon.explorer.state

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel

/** The four bottom-navigation destinations. */
enum class TabId(val label: String, val initialScreen: String) {
    Explore("Explore", Screen.HOME),
    Collection("Collection", Screen.COLLECTION),
    Compare("Compare", Screen.COMPARE),
    Guide("Guide", Screen.TYPE_GUIDE),
}

/** Screen keys used by [AppState.navigate]. */
object Screen {
    const val HOME = "home"
    const val SEARCH = "search"
    const val DETAIL = "detail"
    const val COMPARE = "compare"
    const val COLLECTION = "collection"
    const val TYPE_GUIDE = "typeGuide"
    const val SETTINGS = "settings"

    /** Screens that hide the bottom navigation bar, matching the web app. */
    val HIDDEN_NAV = setOf(SETTINGS, DETAIL, SEARCH)
}

/** One entry on a tab's back stack. */
data class NavFrame(
    val screen: String,
    val id: Int? = null,
    val idA: Int? = null,
    val filterType: String? = null,
)

enum class ThemeSetting(val label: String) {
    System("System"),
    Light("Light"),
    Dark("Dark"),
}

/**
 * Holds navigation stacks, the collection and display preferences.
 *
 * This is the Kotlin equivalent of the web app's `AppContext`: each bottom-nav tab
 * keeps its own back stack, so switching tabs preserves where you were and pressing
 * back inside a tab returns you through that tab's history.
 *
 * State lives in a [ViewModel], so it survives configuration changes (rotation,
 * dark-mode switches, resizing) — something the original browser state did not.
 */
class AppState : ViewModel() {

    var activeTab by mutableStateOf(TabId.Explore)
        private set

    private val stacks = mutableStateMapOf(
        TabId.Explore to listOf(NavFrame(Screen.HOME)),
        TabId.Collection to listOf(NavFrame(Screen.COLLECTION)),
        TabId.Compare to listOf(NavFrame(Screen.COMPARE)),
        TabId.Guide to listOf(NavFrame(Screen.TYPE_GUIDE)),
    )

    val currentFrame: NavFrame
        get() = stacks.getValue(activeTab).last()

    val canGoBack: Boolean
        get() = stacks.getValue(activeTab).size > 1

    /** Seeded to match the web app's demo data so the Collection screen isn't empty on first run. */
    var favourites by mutableStateOf(setOf(25, 1, 6))
        private set

    var caught by mutableStateOf(
        setOf(25, 1, 6, 7, 4, 5, 152, 249, 250, 384, 143, 59, 130, 131, 9, 3, 65, 68, 76, 94, 149),
    )
        private set

    var theme by mutableStateOf(ThemeSetting.Dark)
        private set

    fun selectTab(tab: TabId) {
        activeTab = tab
    }

    /** Pushes a new screen onto the active tab's stack. */
    fun navigate(
        screen: String,
        id: Int? = null,
        idA: Int? = null,
        filterType: String? = null,
    ) {
        val frame = NavFrame(screen = screen, id = id, idA = idA, filterType = filterType)
        stacks[activeTab] = stacks.getValue(activeTab) + frame
    }

    /** Pops the active tab's stack. No-op at the root of a tab. */
    fun goBack() {
        val stack = stacks.getValue(activeTab)
        if (stack.size <= 1) return
        stacks[activeTab] = stack.dropLast(1)
    }

    fun toggleFavourite(id: Int) {
        favourites = favourites.toggle(id)
    }

    fun toggleCaught(id: Int) {
        caught = caught.toggle(id)
    }

    fun resetCollection() {
        favourites = emptySet()
        caught = emptySet()
    }

    fun setTheme(value: ThemeSetting) {
        theme = value
    }

    private fun Set<Int>.toggle(id: Int): Set<Int> =
        if (contains(id)) this - id else this + id
}
